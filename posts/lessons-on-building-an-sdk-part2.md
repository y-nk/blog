---
title: Lessons on building an SDK (part2)
description: Basic patterns and foundations of an sdk
timestamp: 1591228800001
---

In this article we'll cover basic patterns that I discovered and crafted for the SDK I was working on at LINE. If you need more context, you can read the first part of this serie called: [lessons on building an sdk (part1)](lessons-on-building-an-sdk-part1.html).


<span class="!">disclaimer</span> this article explains design patterns and abstract concepts while applying them with TypeScript. You should be prepared that the talk is pretty deep.



### The guardian pattern

#### Overview

I'm not sure that it's the right way to name this pattern, but as you'll see it's an easy way to describe it.

In order to "keep model dumb", "be (im)mutable" and "sync with backend atomicly" I came up with a simple abstract object which somehow acts as [a delegator](https://en.wikipedia.org/wiki/Delegation_pattern) ; but where delegation would mainly "wrap up" methods on a higher level, here it acts upon a model, manipulate it and handle everything that a model should handle itself : like [a guardian](https://en.wikipedia.org/wiki/Legal_guardian).

It goes like this:

```ts
type Commit<C> = (patch: Partial<C>, context?: C) => void

// C stands for "Context", T for "Type"
class PropertyOf<C, T extends object> {
  get value(): T { return null! }

  set value(val: T) {
    if (!this.commit)
      throw new Error('this value is readonly')

    if (this.value !== val)
      this.commit(this.patch(val), this.context)
  }

  public patch(val: T): Partial<C> {
    throw new Error('the patch function isnt implemented')
  }

  constructor(
    protected context: C,
    protected commit?: Commit<C>,
  ) {}
}
```

**This core thing is what makes (im)mutability work.** It goes like: when setting a value, produce the minimum patch to mutate the context with a given value, and then call a commit function which will use this patch and the model to act as a setter. Making the distinction between the steps allows to implement both mutable and immutable flows easily.

Let's try to use this class with a very simple example:

```ts
import { PropertyOf } from '~/core'
import { UserModel } from '~/users'

class DisplayNameOf<C = UserModel> extends PropertyOf<C, string> {
  get value() { return this.context.displayName ?? '' }

  public patch(val) {
    return { displayName: val }
  }

  constructor(
    model: C,
    commit: Commit<C> = ({ displayName }, context) => { context.displayName = displayName }
  ) { super(model, commit) }
}

export default (context, commit) => new DisplayNameOf(context, commit)
```

First you'd need to extend and qualify the types of the `PropertyOf` class, then implement the value's getter and patch function.

The `constructor` here has been overloaded with default parameters. **The key component is the default value of the commit parameter.** By default, the commit function uses the patch given by the setter to mutate the existing model.

We keep the commit function as a parameter to allow customization is setter behavior without endangering the guardian or its model. That said, **even if the model mutates, the guardian object remains stateless** and easily replaceable. It doesn't hold anything and can be garbage collected, leaving only the domain's objects in memory (for example in your state manager). 

Here's a mutable example:

```ts
import { userFetchByNickName } from '~/fakeApi'
import displayNameOf from '~/users/displayNameOf'

const user = await userFetchByNickName('y_nk')
const displayName = displayNameOf(user)

// Easy one: calling the getter
console.log(displayName.value) // y_nk

/*
  Let's call the setter

  Call stack:
    1. call to .patch(val) to produce "the minimum patch to apply"
    2. call to .commit(patch, model)
    3. => default commit executes: model.prop = patch.prop

  So it's mutated correctly!
*/
displayName.value = displayName.value.toUpperCase()

console.log(displayName.value) // Y_NK
```

Since `displayName.value` is a pair of getter/setter, it also means that **it's ok to use reactive libraries** (for VueJS users, it means you can `v-model` it).

If you wish to implement it in an immutable way (to hook it with React's `setState`) you'd only have to provide your own commit function:

```ts
import React from 'react'

import { userFetchByNickName } from '~/fakeApi'
import displayNameOf from '~/users/displayNameOf'

class Name extends React.Component {
  state = {}

  async componentWillMount() {
    const user = await userFetchByNickName('y_nk')
    this.setState({ user })
  }

  render = () => {
    const { user } = this.state

    // here's the magic. we branch out for a closed update cycle
    // and instead propose to call setState to update the model
    const commit = (patch, model) => this.setState({
      user: { ...model, ...patch }
    })

    const displayName = displayNameOf(user, commit)

    // hopefully when the setter will be called,
    // setState will be called and the component will re-render
    const onClick = () => {
      displayName.value = displayName.value.toUpperCase()
    }

    return <div>{ displayName.value }</div>
  }
}
```

The base seems flexible enough to see the future, yet stable enough to start to build upon.
After this realization it was quite easy to implement additional features.

#### Default values and draft objects

For models which have been created and not yet saved in db, there's one easy thing to do: initialize the guardian with an empty object, and call the setter with a default value: because the setter creates a patch and the patch is an object structure, then the property will be created dynamically.

```ts
const draft = {} // empty structure
const displayName = displayNameOf(draft)

console.log(displayName.value) // '' (because we added a default value with "?? ''")

displayName.value = 'default'
console.log(draft) // { displayName: '' } created by the set/patch/commit flow
```

#### Getter-only shortcuts

Properties which didn't need any of the complexity could be reduced to a bare minimum (ready to be extended later):

```ts
import { PropertyOf } from '~/core'
import { UserModel } from '~/users'

class UserIdOf<C = UserModel> extends PropertyOf<C, string> {
  get value() { return this.context.userId }
}

// if one day this becomes writable, no need to refactor a lot. just override patch()
export default (context) => new UserIdOf(context)
```

#### Data validation

We built own our data validation system at the heart of the sdk. This allows to have entirely custom validation process which fits and follows server side rules. This part is the only one we duely "copied" from the server.

The core elements library looks a bit like :

```ts
// blueprint of a single validator
export type Validator<T> = (value: T) => boolean

// a collection of validators
export type Validators<T> = Record<string, Validator<T>>

// a reducer to execute all validators and aggregate their result
export const validate = <T>(value: T, validators: Validators<T>): Record<string, boolean> => (
  Object.entries(validators)
    .map(([key, validator]) => ({ [key]: validator(value) }))
    .reduce((a, b) => ({ ...a, ...b }), {})
)
```

It looks amazingly small but there wasn't so much more to do to be honest. We also created some basic validators so start with:

```ts
import { Validator } from '~/validators'

export const required: Validator<string> = val => !!val

export const minlength = (min: number): Validator<string> => (
  val => val?.length >= min
)

export const maxlength = (max: number): Validator<string> => (
  val => val?.length <= max
)
```

The integration was lightweight. We only needed to add few things:

```diff
+import { Validators, validate } from '~/validators'

type Commit<C> = (patch: Partial<C>, context?: C) => void

class PropertyOf<C, T extends object> {
+ get sanity(): Record<string, boolean> {
+   return validate(this.value, this.validators)
+ }

+ get sane(): boolean {
+   return Object.values(this.sanity).every(check => check)
+ }

  get value(): T { return null! }

  set value(val: T) {
    if (!this.commit)
      throw new Error('this value is readonly')
      
    if (this.value !== val)
      this.commit(this.patch(val), this.context)
  }

  public patch(val: T): Partial<C> {
    throw new Error('the patch function isnt implemented')
  }

  constructor(
    protected context: C,
    protected commit?: Commit<C>,
+   protected validators: Record<string, Validator<T>> = {},
  ) {}
}
```

Because `sanity` and `sane` are getters, their values are calculated everytime you access them, so it's always up to date. **No need for reactivity, for which getters are already native computed values** (without a cache system, but still.)

To implement it on your side, simply add:

```diff
import { PropertyOf } from '~/core'
import { UserModel } from '~/users'
+import { required, minLength, maxLength } from '~/validators'

+const validators = {
  required,
  minLength: minLength(1),
  maxLength: maxLength(64),
}

class DisplayNameOf<C = UserModel> extends PropertyOf<C, string> {
  get value() { return this.context.displayName ?? '' }

  public patch(val) {
    return { displayName: val }
  }

  constructor(
    model: C,
    commit: Commit<C> = ({ displayName }, context) => { context.displayName = displayName }
-  ) { super(model, commit) }
+  ) { super(model, commit, validators) }
}

export default (context, commit) => new DisplayNameOf(context, commit)
```

When using, you'd get:

```ts
const user = { displayName: 'y_nk' }
const displayName = displayNameOf(user)

console.log(displayName.sane) // true
console.log(displayName.sanity) // { required: true, minLength: true, maxLength: true }

displayName.value = ''

console.log(displayName.sane) // false
console.log(displayName.sanity) // { required: true, minLength: false, maxLength: true }

displayName.value = 'im way too old for this goddamn validation thing.'

console.log(displayName.sane) // false
console.log(displayName.sanity) // { required: true, minLength: true, maxLength: false }
```

That way, the guardian would provide proper validation report without taking side on throwing errors, showing alerts or preventing setting the value. The UI can do whatever ui-necessary thing it wants to based on that, but always the validation will happen outside of it.

#### Server synchronization

As a mean to "have everything in one place", we also decided to integrate server side update into the `PropertyOf` class. It's a process way too intimate for each property, but nevertheless we could at least add some shortcuts in our base class:

```diff
import { Validators, validate } from '~/validators'

type Commit<C> = (patch: Partial<C>, context?: C) => void
+type Push<T> = (val: T) => Promise<any> // a push is a function which "pushes" changes somewhere distant

class PropertyOf<C, T extends object> {
+ public sync: boolean = true

  get sanity(): Record<string, boolean> {
    return validate(this.value, this.validators)
  }

  get sane(): boolean {
    return Object.values(this.sanity).some(check => !check)
  }

  get value(): T { return null! }

  set value(val: T) {
    if (!this.commit)
      throw new Error('this value is readonly')
      
-    if (this.value !== val)
+    if (this.value !== val) {
      this.commit(this.patch(val), this.context)
+     this.sync = false // concept similar to "dirtiness"
+    }
  }

  public patch(val: T): Partial<C> {
    throw new Error('the patch function isnt implemented')
  }

  constructor(
    protected context: C,
    protected commit?: Commit<C>,
    protected validators: Record<string, Validator<T>> = {}
  ) {}

+ async push(call: Push<T>): Promise<boolean> {
+   if (!call || this.sync) // no need to call if in sync. save bandwidth
+     return true
+
+   if (!this.sane) // strongly disagree on updating what you know is invalid
+     throw new Error('the value youre trying to sync is invalid')
+
+   try {
+     await call(this.value)
+     this.sync = true // reset the marker
+     return true
+   }
+   catch(e) {
+     return false
+   }
+ }
}
```

Which requires few lines later on:

```diff
+import { axios } from '~/axiosClient'

import { PropertyOf } from '~/core'
import { UserModel } from '~/users'
import { required } from '~/validators'

const validators = { required }

class DisplayNameOf extends PropertyOf<UserModel, string> {
  get value() { return this.context.displayName ?? '' }
  
  public patch(val) {
    return { displayName: val }
  }

  constructor(
    model: C,
    commit: Commit<C> = ({ displayName }, context) => { context.displayName = displayName }
  ) { super(model, commit, validators) }

+ async push() {
+   const push = async val => await axiosClient.put(`/api/user/${this.context.userId}`, { value: val })
+   return super.push(push)
+ }
}

export default (context, commit) => new DisplayNameOf(context, commit)
```

We'd use it as:

```ts
const user = { displayName: 'y_nk' }
const displayName = displayNameOf(user)

displayName.value = displayName.value.toUppercase()
const onSaveButtonClick = async () => await displayName.push()
```

With this class only, we could create code which could drive every single form input and data bound to a model, but the strength of this pattern doesn't stop here.

#### Virtual properties

There were some cases where data would be buried deep in the model structure, making it painful to retrieve or check against. Sometimes, the data structure itself wouldn't be so convenient to the frontend needs.

We started to see that the guardian pattern could also serve this purpose. **Since everything was getters and setters, why not abstract ourselves from the model data structure and provide a strong independant and reliable structure on top?**

With a data model of:

```ts
type BlogPost = {
  id: string,
  status: 'draft' | 'published',
}
```

We can leverage the use of `value` getter and setter to create an abstraction which takes care of _business decisions_ built on top of our pure model. We no longer deal with `status: string` but rather `isPublished: boolean`:

```ts
import { axios } from '~/axiosClient'

import { PropertyOf } from '~/core'
import { BlogPost } from '~/users'

// notice that here, T is boolean rather than string
class IsPublished extends PropertyOf<BlogPost, boolean> {
  get value() {
    return this.context.status === 'published'
  }

  public patch(val) {
    const status = val ? 'published' : 'draft'
    return { status }
  }

  async push() {
    const push = async val => {
      const status = val ? 'published' : 'draft'
      await axios.put(`/api/posts/${this.context.id}`, { status })
    }

    return super.push(push)
  }
}

export default (context, commit) => new IsPublished(context, commit)
```

### Going bigger

Well that was quite rich and long but I hope you enjoyed. In [the next post](lessons-on-building-an-sdk-part3.html) we'll exploit this object even more to build complex data structures such as models and collections.

---
title: Lessons on building an SDK (part3)
description: Concerns and primary goals while coding a library
timestamp: 1591228800002
---
_This article follows the [lessons on building an sdk (part2)](lessons-on-building-an-sdk-part2.html)._

<span class="!">disclaimer</span> this article explains design patterns and abstract concepts while applying them with TypeScript. You should be prepared that the talk is pretty deep.

### Wrapping it all in a model

Having properties independently is nice, but could become cumbersome if you had (like us) huge models (50+ props). Even with all the conveniency we had, forms were having 50 PropertyOf instances, and as much in computed getters/setters to link v-model properly. Not so scalable.

By building the `PropertyOf` class (from the previous part), we could allow ourself to go bigger. We can make a wrapper class, _for which we only define getters to PropertyOf instances._

We'd like to code only that much.

```ts
import { WrapperFor } from '~/core'
import { UserModel } from '~/users'
import displayNameOf from '~/users/displayNameOf'

class User extends WrapperFor<UserModel> {
  get displayName() {
    return displayNameOf(this.model)
  }

  constructor(model) {
    super(model, ['displayName'])
  }
}
```

So the inside should look like this:

```ts
import { PropertyOf } from '~/core'

// quick and dirty cloning utility
const clone = value => (
  typeof prop.value !== 'object' ? prop.value :
  Array.isArray(value) ? [...value] : 
  { ...prop.value }
)

class WrapperFor<Model> {
  // the model is in sync if all its properties are
  get sync(): boolean {
    return this.props.every(prop => this[prop].sync)
  }

  // the model is sane if all its properties are
  get sanity(): Record<string, boolean> {
    return this.props
      .map(prop => ({ [prop]: this[prop].sane }))
      .reduce((a, b) => ({ ...a, ...b }), {})
  }

  // easy boolean all-in-one report
  get sane(): boolean {
    return Object.values(this.sanity).every(check => check)
  }

  constructor(
    public model: Model,
    private props: string[],
  ) {}

  async push(complete = false): boolean {
    if (this.sync)
      return true

    if (complete && !this.sane)
      throw new Error('the model youre trying to sync is invalid')

    // we compute a { getterName: PropertyOf } collection filtering out 
    // the invalid ones (validation errors) and synced ones (pristines).
    const props: Record<string, PropertyOf> = this.props
      .filter(prop => this[prop].sane && !this[prop].sync)
      .map(prop => ({ [prop]: this[prop] }))
      .reduce((a, b) => ({ ...a, ...b }), {})

    const cache: object = {}

    for (const [name, prop] of Object.entries(props)) {
      cache[name] = clone(prop.value) // we clone the value to avoid referencing objects

      const updated = await prop.push()

      // if one update fails, we revert the entire sync one prop at a time
      if (!updated) {
        for (const [prop, value] of Object.entries(cache)) {
          this[prop].value = value
          await this[prop].push()
        }

        return false
      }

      delete cache[name]
    }
  
    return true
  }
}
```

With only this much code we had a simple way to have a full model connected with a backend, all thanks to the atomic updates of PropertyOf.

This pattern is simple enough to get going with most of cases we had to encounter, although the `push()` implemention doesn't allow for bulk updates since it's just looping over each properties ; but that's fine since our backend strategy is built on this principles.

...

**Soon enough we had additional features which broke this promise**. As a reaction, we created a second version of the push implementation which would allow for patch-like updates transparently. We did not alter or destroy the first version since it was a requirement for _some_ of the models.

```ts
import { PropertyOf } from '~/core'

// quick and dirty cloning utility
const clone = value => (
  typeof prop.value !== 'object' ? prop.value :
  Array.isArray(value) ? [...value] : 
  { ...prop.value }
)

type Push<T> = (val: T) => Promise<any>

class WrapperForV2<Model> extends WrapperFor<Model> {
  async push(call: Push<Partial<Model>>, complete = false): boolean {
    if (this.sync)
      return true

    if (complete && !this.sane)
      throw new Error('the model youre trying to sync is invalid')

    // same aggregation here
    const props: Record<string, PropertyOf> = this.props
      .filter(prop => this[prop].sane && !this[prop].sync)
      .map(prop => ({ [prop]: this[prop] }))
      .reduce((a, b) => ({ ...a, ...b }), {})

    const patch: Partial<Model> = {}

    // we build our patch by calling the internal "patch" of a prop, which
    // normally is used to create a single local mutation for a model.
    for (const [name, prop] of Object.entries(props))
      patch = { ...patch, ...prop.patch(prop.value) }
    
    try {
      await call(patch)

      for (const prop of Object.values(props))
        prop.sync = true // we manually mark the prop as synced finally

      return true
    }
    catch(e) {
      return false
    }
  }
}
```

### Extending to collections

The last block we needed was "managed collections". There are two types of them: the one which ids are only returned, and the one which are returned as part of a bigger object.

For the id ones, you can use PropertyOf and consider the array as a single data type. You'll need to do "immutable manipulations" and avoid `.push`, `.pop`, `.shift`, `.unshift` or `.splice` (as per usual) - otherwise it should be fine.

For nested structures which are handled as collections, we can also use PropertyOf to manage the root node itself, but items of the collection need to be handled individually - so there's a need to build a tool for that.

Consider the domain:

```ts
type Locale = 'en' | 'fr' | 'jp'

type Localized = {
  name: string
  description: string
}

type Item {
  id: string
  i18n: Record<Locale, Localized>
  categories: string[]
}
```

A typical data structure grabbed by a server call would be:

```ts
import { getArticleById } from './someFakeAmazonApi'

const article: Item = await getArticleById('B071R5W4YS')
console.log(article)

/*
{
  id: 'B071R5W4YS',
  i18n: {
    en: {
      name: "french bread",
      description: "crispy and unique to french country",
    },

    fr: {
      name: "une baguette",
      description: "on reve de ce qu'on peut, me jugez pas",
    }
  }
}
*/
```

When being in a back office where you need to manage the i18n sub-structure, you'd have actions to add or remove languages, and each language should be editable independently.

For the _each language should be editable independently_, we're gonna stick to the basics.

```ts
import { PropertyOf } from '~/core'

class LocalizedName extends PropertyOf<Localized, string> {
  get value() { return this.context.name }
  public patch(name) { return { name } }
}

class LocalizedDescription extends PropertyOf<Localized, string> {
  get value() { return this.context.description }
  public patch(description) { return { description } }
}
```

Note that we didn't provide a default value as fallback. This is intentional since in the next block we'll abuse this information (`value === undefined`) to provide default values there instead (see [part2](/lessons-on-building-an-sdk-part2.html#default-values-and-draft-objects) for reminder).

Let's wrap the `Localized` model into a bigger object.

```ts
class LocalizedWrapper extends WrapperFor<Localized> {
  get name() { return new LocalizedName(this.model) }
  get description() { return new LocalizedDescription(this.model) }

  constructor(model: Localized = {}) {
    super(model, ['name', 'description'])

    if (!this.name.value)
      this.name.value = ''

    if (!this.description.value)
      this.description.value = ''
  }

  // we override this method to prevent usage
  async push() {}
}
```

At this point we can create new LocalizedWrapper objects with `new LocalizedWrapper()` and its internal model will be ready to insert in the collection.

As the `i18n` collection is just a property of `Item`, we can simply extend PropertyOf with according types and code `add` and `del` methods.

The trick to make it work is to use manually the commit function and provide a "custom patch" which contain the collection with or without a specific key.

We'll also re-wire the sanity getter to sub instances.

```ts
class LocalizedCollection extends PropertyOf<Item, Record<string, Localized>> {
  // we change sanity to show all sub properties of i18n (dynamically)
  get sanity() {
    return Object.entries(this.context)
      .map(([key, localized]) => ({
        [`i18n.${key}`]: new LocalizedWrapper(localized).sane
      }))
      .reduce((a, b) => ({ ...a, ...b }), {})
  }

  constructor(
    model: Context,
    commit: Commit<Context> = ({ i18n }, context) => { context.i18n = i18n }
  ) { super(model, commit) }

  add(key: string, draft: Partial<Localized> = {})  {
    // we use this to initialize default data structure
    const wrapper = new LocalizedWrapper(draft)

    this.commit({ ...this.context, [key]: draft })
    this.sync = false
  }

  del(key: string) {
    const { [key]: omit, ...model } = this.context

    this.commit({ model })
    this.sync = false
  }
}
```

And that's pretty much the last block missing to our arsenal.<br>**After that, everything has been based on the same patterns.**

Here's how to _use_ those objects in a Vue component (very quickly):

```html
<template>
  <div class="i18n">
    <div class="lang" v-for="(wrapper, lang) in i18n">
      <h2>{{ lang }}</h2>
      
      <label>Name:</label>
      <input type="text" v-model="wrapper.name.value">
      <div v-if="!wrapper.name.sane">
        {{ wrapper.name.sanity }}
      </div>

      <label>Description:</label>
      <input type="text" v-model="wrapper.description.value">
      <div v-if="!wrapper.description.sane">
        {{ wrapper.description.sanity }}
      </div>

      <button :disabled="!wrapper.sane" @click="() => collection.del(lang)">Delete</button>
    </div>

    <div>
    <input type="text" @keypress.enter.prevent="add">
    <button :disabled="!dirty || busy" @click="save">save</button>
  </div>
</template>

<script>
export default {
  props: {
    i18n: {
      type: Object,
      required: true,
    }
  },

  data: () => ({
    busy: false
  }),

  computed: {
    collection: vm => new LocalizedCollection(vm.i18n),
    sanity: vm => collection.sanity,
    dirty: vm => !collection.sync,

    wrappers: vm => Object.entries(vm.i18n)
      .map(([key, value]) => { [key]: new LocalizedWrapper(value) })
      .reduce((a, b) => ({ ...a, ...b }), {})
  },

  methods: {
    add({ target }) {
      this.collection.add(target.value)
      target.value = ''
    },

    async save() {
      this.busy = true
      await this.collection.push()
      this.busy = false
    }
  }
}
```

The whole process has been a success so far. **We removed business rules and complexity from frontend and allow frontend to be extensible and replacable without having to recode everything from scratch next time.** We moved the complexity away from Ui to a core package, which also avoid cluttering the Ui space with business rules and let the Ui do what a Ui should do only. More importantly, the codebase of the sdk being pure javascript, we already started to have CLI tools to help engineers of the company to build things as part of their own projects.

### Thanks for reading!

I hope this small 3 part serie was as nice for you as it was for me. I've been trying my best to summarize our efforts in the most concise way, hoping you'll find some values in it. I know it's been a long read but I truely believe I can't cut more than I already did.

I'm pretty sure there are other ways to architecture an SDK especially if you had better backend conditions. **We did what we did because it suited us, and that should always be your first priority.**

With these patterns we had to produce lots of code on the SDK side _(and i've been adding shorter versions in here, our codebase isn't that advanced)_ but the consumer side has never been cleaner and has a bright future ahead, and when writing an SDK I believe that's the target you reach for.

In the possible improvements to make our own DX better, there's obviously some factorization possible and generators to create (you can really see it in the last `LocalizedName` and `LocalizedDescription` examples), a possible abstraction of the concept of collection (with a version for Array as well), and why not html5 attributes generators from validators.

The world is yours! Go create!

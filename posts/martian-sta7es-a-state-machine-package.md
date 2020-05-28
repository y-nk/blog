---
title: martian.sta7es, a state machine package
description: Deepdive into the routing system of my AS3 library
timestamp: 1321196400000
---
<disclaimer>The original article has been retrieved from the internet archive machine and edited for fluidity.</disclaimer>

### What is a state machine.

According to wikipedia, a “final” state machine is:

> a mathematical model used to design computer programs and digital logic circuits. It is conceived as an abstract machine that can be in one of a finite number of states. The machine is in only **one state at a time**; the state it is in at any given time is called the current state. It can **change from one state to another when initiated by a triggering event** or condition, thisis called a transition. A particular FSM is defined by a list of the possible states it can transition to from each state, and the triggering condition for each transition.

Applied to flash, a state machine could be an entity that manage levels in a game or more advanced, **manage the display list in order to be at a given state at any time**. And that’s exactly what it's all about here.

This package deals with handling the display list of a flash application, such as a website. It ensures that a given screen (Sprite, Movieclip) will be displayed given certain parameters (mainly, a url).

To do so, we'll need some kind of regulating agent (a router, basically): the **Front Controller**.

### The smart guy

It should be very familiar to you if you come from the server-side world. In the backend the front controller is usually a simple, straightforward, most of the time config-driven routing system. It only applies one state but rarely survives further since every webpage is a new instance of the program (http being single calls, if you get me).

In the client, the application is always the same instance. It runs and mutates continously... so we kinda need to separate who decides and who applies, since the application process is a finished algorithm, but the decision part isn't.

So the plan is simple, there'll be a **front controller** which will **decide** which state to apply but the execution will be delegated to a **the state machine** which will only **apply** the change. All that so the complicated code will be in my library (the state machine), while you'll be providing the front controller (basically a big switch case statement).

Let’s do some code. To make lines shorter, I called the state machine `State`, and the interface of a FrontController `Controller`.

First, we create the state machine, and initialize it.

```
var state:State = new State();
state.hook(this, new MyController());
```

and to trigger a change:

```
state.load('/home');
```

As said in the wikipedia definition, a finite state machine should know about all the states and all the triggers. But since the task is separated into two objects, only the front controller needs to know about that.

Let’s have a look at our `MyController()` :

```
public class MyController implements Controller {
	public function handle(slug:String): Statement {
		switch(slug) {
			case '/home':
				return new Statement(HomeClip);

			case '/contact':
				return new Statement(ContactClip);
		}

		return null;
	}
}
```

That's all you need to know. A controller is a simple object which needs a single function `handle`.
This function takes a `slug` (a kinda url) in input, and returns a `Statement`.

Now, when the state machine will be aware of a triggering event (such as an url change), it will ask the front controller "what I should do about it?" and your code will reply something like "yeah, show that Movieclip".

Here, the `Statement` object represents a wrapper for data about the next state. It’s holding: the next state itself, but also some parameters you would pass to it and the type of transition to apply as well as optional parameters for that transition.

Yes ; because it’s visual, you may want to apply transitions between two states, so your clips just don’t appear/disappear like a flash in a millisecond.

### Transitions

I spent a lot of time thinking about modularity and what would be the best compromize between a dummy implementation and a brain fucking one. After a while, i went to this simple idea: a transition only needs to know about where it comes from and where it goes. That’s it.

Let’s say we want to create something like a _crossfading_ transition:

```
public class CrossFading extends Transition {
	public function CrossFading(a:DisplayObject, b:DisplayObject):void {
		super(a, b);
	}

	override public function setup(): void {
	}

	override public function start():void {
	}
}
```

That’s all you need to start. The end of your transition should be notified by a `Transition.STOP` event dispatch.

Because of the diversity of the effects you would want to perform, i figured out that the state machine **should not care** about dealing with the addChild/removeChild stuff. **It’s up to the transition to know what to display at any time**.

```
public class CrossFading extends Transition {
	private var duration:Number;

	public function CrossFading(a:DisplayObject, b:DisplayObject):void {
		super(a, b);
	}

	override public function setup(mod_params:Object = null, trans_params:Object = null):void {
		this.duration = trans_params.duration;
	}

	override public function start():void {
		TweenMax.to(a, 400, { autoAlpha:0, onComplete:p.removeChild, onCompleteParams:[a] });
		TweenMax.from(b, 400, { autoAlpha:0, onComplete:dispatchEvent, onCompleteParams:[new Event(Transition.STOP)] });
	}
}
```

There are some details about what’s going on here:

• the `setup` function is called by the state machine right after the construction of the transition, and it initializes it with some given parameters.

• the Transition has a `start():void;` function which reminds of the `Stackable` interface from [martian.t1me package](./martian-t1me-a-sequencing-package.html)... because it implements it :) So, any transition is `Stackable` and can be used in sequences of transitions (...madness).

• An other good thing is that if you take some time to code your transition and design it well, you can keep it in a separate toolbox.

• Finally, it’s also very cool to notice that **Transition could also work in standalone mode**. If you need a special fx for a project that doesn’t use any state machine, it doesn’t matter.

So now, how to plug this nice transition into our front controller:

```
public class MyController implements Controller {
	public function handle(slug:String):Statement {
		switch(slug) {
			case '/home':
				return new Statement(HomeClip, {
					transition: CrossFading,
					transition_parameters: { duration:200 }
				});

			case '/contact':
				return new Statement(ContactClip, {
					transition: CrossFading, 
					transition_parameters: { duration:200 }
				});
		}

		return null;
	}
}
```

I had **lots** of differents tries with that implementations.

Thing is, _sometimes_ i was passing parameters to the state itself, _sometimes not_ ; _sometimes_ i was using a Transition, and _only sometimes with_ parameters. There were **too many sometimes**, so I decided to write the `Statement` constructor with only the one mandatory parameter and then all other extra parameters wrapped in a big anonymous object — it can be lame since it's not typed, but it’s damn handy.

Now, when triggering an changing event the state machine will take the condition, give it to the front controller, receive a Statement of what to do. It will create the new state, the given transition and will let the transition do its work until it's done.

The first transition I did was (obviously) one (named `Cut`) which does a simple `addChild`/`removeChild` switch. Then, I realized sometimes a DisplayObject should be able to manage itself how it should appear and disappear ; for this usecase I added my second core transition, called `Slave`.

The slave transition will work with a certain type of Sprite, and instead of actively doing its transition work, will call the `show` or `hide` methods of that special Sprite to perform the transition.

### Introducing Module

It could be seen as a super Sprite. A Sprite that is **aware of the different steps of being a part of a state changing process**. It knows about initialization, appearance, disappearance, and destruction.

It’s pretty useful and could be used as a replacement of the regular Sprite, even without any state machine. It’s a very broad concept and I think it should be named in a way that people it could work separatedly, to keep in mind the modularity. Thus, `Module`.

It has 4 main functions: **init**, **show**, **hide**, and **kill** for initialization, appearance, disappearance, and destruction.

As this type belongs to the state machine system, the state machine itself can the initialization and destruction processes. 

Initialization is known as completed by the state machine when the module dispatches a `Module.READY` event while destruction needs a `Module.KILLED` event.

Appearance and disappearance processes should be handled, naturally, by a Transition since it’s a visual effect... and that’s what the `Slave` transition does: it performs a simple hide/show sequence letting each module (_current_ and _next_) deal with their visual animations. To let the Slave transition know about the progression of appearance/disappearance, each module needs to dispatch a `Module.SHOWN` or `Module.HIDDEN` event.

With that kind of system, it’s damn easy to do whatever you want:

• If you need a kind of _external_ transition, simply extend Transition
• If you need a kind of _internal_ transition, use Slave directly
• If you need an _internal_ transition but with overlaping of the 2 modules, use Slave and dispatch your `Module.HIDDEN` before the end of your transition
• If you need both internal and external transition system, you can try your own Transition and take care internally of the events

That way, it’s fully customizable with staying the best compromize between flexibility and hard coding.

### Deeplinking

As you may know, deeplinking is a technique which (roughly) listen to the url of the browser, and react to it (with changes on the screen, parameters etc...).

If you remember the way to load a state, the `state.load` take a _slug_ as input. It could be any kind of string, so why not the browser's url?

As I already worked on my own deeplinking library, it has been **very** easy to implement the connection with the state machine... but as it’s not necessary to use it, I kept it a bit separated :) That way, the deeplinking part is away from the state machine and should be initialized separately ; when it’ll initialized the state machine will know it automatically, and any external change will be treated as a triggering event by the state machine.

```
var deeplinking:Deeplinking = new Deeplinking();
deeplinking.hook(stage);
```

Under the hood, I worked on a way for them to _know_ each other. When instanciated, they register themselves into a common static dictionary, so they can ask for each other from there.

### Cherry on the cake

Because medium to big projects can have a verbose front controller structure, I decided to create an xml based configurable controller. It’s highly inspired from the C# routing system, and that’s probably why it’s called `Router`.

Let’s see how it works, and then, its xml definition scheme.

```
var state:State = new State();
state.hook(this, new Router(someXML, customValidationObject));
```

For now, we'll talk about the `someXML` part. If you give an XML, it will use it directly. If you pass a String ending with `.xml` or `.php`, it will handle the process of loading that file. Worth noticing, `Router` is a `Stackable` object, so you can (and should) put it in a Queue at the beginning of your project.

```
<data>
	<states app="app.states" default="/">
		<state>
			<id>home</id>
			<module>Home</module>
			<slug>/</slug>
			<title></title>
			<keywords></keywords>
		</state>

		<state>
			<id>page1</id>
			<module>Page1</module>
			<slug>
				<pattern>/page/1</pattern>
				<parameters>
					<color>0xff0000</color>
				</parameters>
			</slug>
			<title></title>
			<keywords></keywords>
		</state>
		
		<state>
			<id>pages</id>
			<module>OtherPage</module>
			<slug>
				<pattern>/page/{var1}/{var2}/{var3}</pattern>
				<constraints>
					<var1>@[0-9]</var1>
					<var2>delegatefunction</var2>
					<var3 optional='true' />
				</constraints>
			</slug>
			<title></title>
			<keywords></keywords>
		</state>

		<state>
			<id>404</id>
			<module>Error404</module>
			<slug>/404</slug>
			<title></title>
			<keywords></keywords>
		</state>
	</states>

	<notfound>/404</notfound>
	
	<transitions app="app.transitions" default="Slave">
		<transition from="home" to="*">OverlapIn</transition>
	
		<transition from="*" to="home">
			<name>MyCustomTransitionBack</name>
			
			<parameters>
				<duration>2</duration>
			</parameters>
		</transition>		
	</transitions>
</data>
```

Hum. So here, nothing _really_ complicated. At least, I hope so. I designed it to be self-explanatory, but for the article let me get you through it quickly.

The `states` area has only 2 attributes, which are `app` (the package holding the states), and an optional `default` url (to launch at startup). Each state is defined into a `state` node, nested in the `states` area. A basic state definition looks like:

```
<state>
	<id>a unique id for this state</id>
	<module>the name of the module's class</module>
	<title></title>
	<keywords></keywords>
</state>
```

The title and keywords tags are only there for injecting into the browser. Nothing more. 

On top of that, there's a modulable `<slug />` node which can take multiple forms:

• The _static_ url one: `<slug>/url/to/match</slug>`

• The _dynamic_ url one: 

```
<slug>
	<pattern>/url/{to}/{match}</pattern>
</slug>
```

• The _constraint driven dynamic_ url one:

```
<slug>
	<pattern>/url/{to}/{match}</pattern>
	<constraints>
		<to>@^regex_expression[0-9]*</to>
		<match>delegateFunctionCall</match>
	</constraints>
</slug>
```

In those constraints, you can type a regular regex or the name of a function. This function must be part of the `customValidationObject` given in the constructor of the `Router`. This function must take a String an return a Boolean.

```
var customValidationObject:Object = new Object();
customValidationObject.delegateFunctionCall = function(s:String):Boolean {
	return s.indexOf('valid') != -1;
};

var state:State = new State();
state.hook(this, new Router(someXML, customValidationObject));
```

You can also pass optional parameters which can have default values.
Any time a default value is written, the parameter becomes optional:

```
<slug>
	<pattern>/url/{to}/{match}/{eventually}</pattern>
	<constraints>
		<to>@^regex_expression[0-9]*</to>
		<match>delegateFunctionCall</match>
		<eventually default="false">@(true|false)</eventually>
	</constraints>
</slug>
```

If no pattern matches, the code will eventually throw an Error and break your swf. To prevent that, you can give a `<notfound />` node inside your XML file and it'll your fallback state.

All the parameters coming from the slug will be given in an object during the `init` call of your module. You can even pass mandatory extra parameters with a `parameters` node (as seen in the 'page1' module above).

Transitions can also be set up from the `transitions` area where you can find the same `app` and `default` concepts than in the `<states />` node.

Each transition node has a `<name />` node, which holds the name of the transition’s class, and a `parameters` one similar to slug‘s `<parameters />` node. Those datas will be given in an object at the transition’s `setup` call. You can also set Flex-like filters to define how transitions should apply with the `from` and `to` attributes using a state's `<id />` or `*` to match all.

While the upper layer seems more complex, it's been built once so we don't have to deal with that shit anymore :)

The only drawback of using this XML driven loading strategy is that, since you're not directly referencing your states in the swf they won't be linked at the build... so you gotta force inclusion of your states classes _and transitions_ to link them properly to your application.

And... that's all :)

[Sources for this package can be found here](https://github.com/y-nk/io/tree/master/src/martian/sta7es)

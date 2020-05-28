---
title: martian.t1me, a sequencing package
description: A library about asynchronous task managment in AS3
timestamp: 1321023600000
---
<disclaimer>The original article has been retrieved from the internet archive machine and edited for fluidity.</disclaimer>

This is an introduction article about some part of am AS3 library I wrote.

The sequencing package holds a concept that is used on many parts of the library. So if you're willing to take full advantage of the library, I think it's useful to know what’s going on with this one.

### Quick look

As crazy as it sounds, this _sequencing_ package deals with time (and that'd explain its name, _t1me_). Its primary focus is to handle and regulate how different kind of tasks live during a period of time.

I've been thinking how to represent that in the most minimal way, and here's what I came with:

**A task which can operate through time needs to have a start function, and dispatch a "stop" event.**

You'd think it's pretty basic, but all what I'm about to tell you about sits on that one principle.

So, I've created an interface to represent that. Sadly, interfaces don't include a list of events to be dispatched, so it's not ideal but still. 

```
// a class implementing this interface is expected to dispatch a stop event when the task is complete
interface Stackable {
  public function start(): void;
}
```

I've implemented a bunch of objects using that principle, such as:

• **Load**: which is a unique wrapper around most of the loaders of the Flash APi: Loader, URLLoader, Sound
• **Message**: is a simple AMFphp call
• **Call**: is a single function call with custom arguments. It looks useless at first but trust me it comes handy.
• **Delay**: is basically a unique timer, only to time things out.
• **Shell**: is a wrapper for any existing object to become Stackable without having to extends or create something special.

Some of these objects also implement 2 other interfaces (which came later, on top of the Stackable one):

• **Progressive**: adds a `progress: Number` (0.0 → 1.0) getter.
• **Pausable**: introduces pause/resume functions (which i'm sure you know what are for).

Both are implemented in some of those objects already.

There's also some _misc_ classes:

• **Preloader** holds an abstract logic to handle preloaders with Stackable objects.
• **Time** is only made of static constants.

**The big reveal comes now.**

### Sequencing Stackables

If you want to execute tasks in a specific timeline, I've created some _managers_ for that.

There are 3 types of managers, which cover all the cases:

• A **Sequence()** is an object which runs tasks one by one until the last.
• A **Group()** starts all its tasks at the same time, and all tasks run in parallel.
• A **Queue(conccurents: int)** is a mix of sequence and group. It executes N tasks of a given stack in parallel and when one of them finishes, picks an other task of the remainings and thus until the end.

As an implementation detail, a `Sequence` is a `Queue(1)` meaning the parallel tasks can only be 1 at a time ; a Group is a `Queue(stack.length)` meaning that the size of the parallel tasks is "all the tasks".

And to break your mind even more, those 3 are also implementing `Stackable`, `Progressive` **and** `Pausable`. So you can make a Sequence of Groups containing Queues of image loaders - ever need you _it_.

### Examples

• use of `Load`, wrapper accessibility (events, content access):

```
var image:Load = new Load('img.png', Load.IMAGE);
image.addEventListener(Event.COMPLETE, oncomplete);
image.load();

function oncomplete(e:Event):void {
  var bm:Bitmap = e.target.data as Bitmap;
}

// ---

var xml:Load = new Load('config.xml', Load.TEXT);
xml.addEventListener(Event.COMPLETE, oncomplete2);
xml.load();

function oncomplete2(e:Event):void {
  var data:XML = new XML(e.target.data);
}
```

Let’s try to embed Load into our managers:

• Using a sequence to preloads assets of a website:

```
var config:Load = new Load('config.xml', Load.TEXT);
var locale:Load = new Load('fr_FR.xml', Load.TEXT);
var brands:Load = new Load('brands.png', Load.IMAGE);
var themes:Load = new Load('themes.swf', Load.RSL);

var data:Message = new Message('News.getAll');
var pics:Library = new Library('lib.xml');

var sequence:Sequence = new Sequence();
sequence.addEventListener(Time.STOP, oncomplete);
sequence.stack.push(config, locale, brands, themes, new Call(setup_ui), assets);
sequence.start();

function setup_ui():void {
  /*do something directly with the RSL*/
}

function oncomplete(e:Event):void {
  /* display your data */
}
```

• Using a Group to synchronize tasks of custom objects:

```
var shell1:Shell = new Shell(myCustomObject1, "startFunction", "endingEvent");
var shell2:Shell = new Shell(myCustomObject2, "anotherStartFunction", "diffEndingEvent");

var group:Group = new Group();
group.addEventListener(Time.STOP, oncomplete);
group.stack.push(shell1, shell2);
group.start();

function oncomplete(e:Event):void {
  /* continue process */
}
```

• Using a Queue to parallelize some heavy downloads while small are sequenced:

```
var bigEmbedVideo:Load = new Load('video.swf', Load.SWF);

var queue:Queue = new Queue(2);
queue.addEventListener(Time.STOP, oncomplete);
queue.stack.push(bigEmbedVideo);

for (var i:int = 0; i < 50; i++) {
  queue.stack.push(new Load(i + '.jpg', Load.IMAGE));
}

queue.start();

function oncomplete(e:Event):void {
  /* loading done */
}
```

I think those examples are covering most of the main topics of the package !

As usual, comments are welcome :)

[Sources for this package can be found here](https://github.com/y-nk/io/tree/master/src/martian/t1me)

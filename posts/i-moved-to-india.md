---
title: I moved to India
description: The adventure of coding in a different culture
timestamp: 1398870000000
---
<disclaimer>The original article has been retrieved from personal unpublished archive and redacted for fluidity.</disclaimer>

A year ago, I was doing the craziest thing in my life: I just accepted a job in India without really knowing what it meant.

I've had interviews with the CTO and after a rough test (building a photo app with a webcam in flash) I've been hired - how great is that?

### Landing at 3am

I've never lived outside France, and never studied abroad. I've barely traveled outside Europe so it was quite a shock to land in the middle of the night and get slapped by the 32°C waiting outside for me. Hopefully, the head of our branch in India was here to pick me up _(drunk, but still)_.

### The engineering team

Our office is composed of around 80 engineers all from south India, except for me and my colleague [Marie](https://twitter.com/materrier) _(there are other frenchies but most of them are client-facing roles such as project managers, designers or copywriters)_.

The indian folks are divided into two main branches: backend php developers and html/css "frontend" integrators. Only few of them were comfortable writing Javascript when I arrived.

As for now I've been working with some of both teams into different challenges: most of our project are small facebook game/apps which need some javascript here and there.

### Another engineering culture

As of now, I think I've tried as much as I could to integrate myself smoothly into the team. Nevertheless, I can't help but see how different we are in terms of goals and aspirations being developers.

There's a huge sense of hacking/shortcuting and a call to find easier solutions than I've been able to pull. For the most seniors it's quite ok but the most juniors require deeper code reviews as they could easily forget things while going too fast.

It's also my first time in a team of such a size, which brings different dynamics as well. There's a lot of support from one to another and seniors are highly regarded, like shepards guiding theirs protégés through the journey of coding. It's a kind of senpai/kohai relationship (the same you'd see in Japan) but I guess only western tech companies didn't integrate a "fellowship" paradigm in their culture. 

While they're amazingly fast at coding the things they know already, it seems they've a harder time to adapt to new patterns or new tasks. I'm pretty sure they're capable but it's mainly a problem of self-confidence and/or self-allowance to go over the scope of what they know already.

When being stuck, most keep silent and try as much as they can to fix the issue by themselves. Asking for help is (of course) encouraged within the company, but even though they most of the time won't ask (at least, not to non-indians): this has put me and Marie in emergency mode few times already.

It's almost as if there's a shame in not knowing the solution to a problem. I try my best to mentor and be there for help whenever needed ; I try to show that not knowing is ok (most of the time I google stuff anyway...), and that _knowing to learn_ is much a better asset than _just knowing things_.

### Daily tasks

Most of my time is spent in assisting engineers in their project. I'm like a consultant for small projects. I also help to develop incoming sales pitches, anticipate technical constraints related to frontend and develop the most painful parts of a project. I deliver modules with documentation about how to use them into a wider project. 

Working that way feels good as consulting and helping coworkers is something I actively seek. I like being as close to "my users" as possible since it _really_ helps accelerating the pace of iterations on a product I work on.

The cultural layer makes it even more enriching experience: where in the past I knew how to write a documentation or what kind of architecture to provide to an engineer in order to facilitate their life, now the demands have changed since my indian colleagues seem to have some different ways of thinking (compared to european engineers). I've to adapt myself to their way of working, which forces me constantly to find other solutions for problems I already knew how to solve.

The most obvious example was this project where I had to develop a generic "fruit ninja" engine. It had many features such as _slowmo_, shape based combos recognition and so on.

My normal approach would be to work in layers of abstractions until the consumer is able to compose with modules, passing options to them independently and reach a neatly configured game (almost like jQuery plugin's architecture, if you will).

In the end, after writing documentation with visual help (gifs and such), I had to add an extra layer of complexity on my side with presets to narrow down the amount of configuration needed ; not that they were too lazy or else, rather that they were lost in so many options and possibilites. 

How to configure the engine to get the expected "spec" output was unclear. Being outside their comfort zone, trying to configure the engine in an iterative process, play with settings wasn't something they were looking for. As much as possible, straight forward directions without any space for self-made decisions were prefered.

### A shift in technology

Since I arrived, I've been doing maybe 5% of Flash (Flash is _really_ dead :( ...) which means 95% of Javascript. The company's clients are still targeting IE8 but hopefully I've convinced the CTO and others to force the drop of IE7.

The amount of Javascript that I write now requires a better organization than just _"a .js file in a www/ folder"_. I've blindly replicated the environment I liked in Flash, having a `src/`, `bin/`, `obj/` and `www/` ~like structure and **"bundling"** (I've no clue how to name this process) javascript files alltogether in one minified build.

I've seen [@MrDooB](https://twitter.com/mrdoob) building his Three.JS library using python scripts but I've not so much confidence in doing so. Instead I've been relying on Apache Ant for "building" most of my JS applications. It's a declarative, widely used, battle tested tool with all the tasks I need (and more) so it fits just right ; although what I produce isn't really a build rather just a chain of concat + minify from the google java minifier.

For instance, this is kindof the builds I'm making these days:

```
<?xml version="1.0"?>
<project basedir="." default="compile">
  <taskdef name="jscomp" classname="com.google.javascript.jscomp.ant.CompileTask" classpath="obj/compiler.jar" />

  <target name="compile">
    <concat destfile="bin/js/wc.js">
      <filelist dir="src/">
        <!-- utils -->
        <file name="graphics/css.js" />
        <file name="graphics/ticker.js" />

        <!-- data -->
        <file name="data/poisson.js" />

        <file name="data/model.js" />
        <file name="data/loader.js" />

        <!-- cg -->
        <file name="graphics/box2d.js" />

        <file name="graphics/bubble.js" />
        <file name="graphics/renderer.js" />

        <!-- ui -->
        <file name="ui/mouse.js" />

        <!-- app & main -->
        <file name="app.js" />
        <file name="main.js" />
      </filelist>
    </concat>

    <replaceregexp file="bin/js/worldcup.js" match="^(.)" replace="    \1" byline="true" />
    <loadfile property="bin" srcFile="bin/js/worldcup.js"/>

    <echo file="bin/js/worldcup.js" append="false">;(function(W, D, undefined)
{
    'use strict';

${bin}

})(window, document)</echo>
    </target>
</project>
```

Thanks to this, I've been able to port some of my as3 library concepts, like routing, lifecycle and other into a library. Of course, going back to javascript feels like being a caveman again so there are less things I can do.

I've the intense feeling that we're going backward in time. Javascript isn't as evolved as Actionscript 3 is, the browsers are fragmented and full of bug. They can't handle 3d properly, no gpu acceleration and no working around medias (such as video or audio feed). The world is looking at HTML5 like the messiah but personally I'm wondering if/when we'll be able to reach the FWA SOTD quality again.

### JavaScript school

The shift towards SPAs is inevitable. Our production is mainly php pages but the rise of Backbone and Require.js pushes towards a more fragmented structure where servers would only be APi serving json data and static html/js templates.

Clients are already asking for that but we're struggling to answer to their demands. We lack of taskforce and recruiting good Javascript engineers isn't easy nor cheap.

Because of this, my manager asked me to try to convert some of the engineers from our actual fleet into frontend developers. It seems natural to think we won't need that much php developers when we migrate to newer solutions, and for them a chance to steer their career towards the future.

**This challenge is probably the most exciting I had in years.**

I've been thinking that probably a weekly mailing list with notions would be enough but after listing what needs to be done, probably a bi-weekly 1 hour "physical class" cycle is going to be necessary.

My plan is to first to identify the persons who'd be interested for such a shift in career. I'll be picking from both php and html/css engineers, up to 20 people.

Then I'll sit with them for a while and try to assess they level of expertise in javascript but also dom-wise. I'm pretty sure php engineers will struggle with the dom but html/css engineers won't do much better with architecturing an app.

When this is done, I plan to write some small pages about one javascript notion at a time, probably with some kind of exercices to make them practice a bit.

I'm planning to finish it all and maybe post all somewhere as an archive. If so, i'll add the link here later on.

### So far so good

It's been year and there's an other one to come. I've been making mistakes which have a huge impact on my experience here _(don't you ever try to restructure the CTO's work when you see an architectural chaos)_ but mostly, after the anger and frustration had passed it's been quite a ride.

If you never studied/worked outside from your home country I'm encouraging you to do so. Moving to an other place with an other culture forces you to change your point of view on the world, how what you assumed was "the right way" to do thing, and what's important to you. I'm confident to say I've grew up more this year than the last decade combined. Do this and you'll never regret ; doubt, bail and you'll always will.

I've no wise conclusions but my roommate Sophie told me some deep words somedays, so these will do:

> Whenever you live some other country, home stops being home. You have no home anymore, for your home is now everywhere.

She's wise, isn't she :) ?

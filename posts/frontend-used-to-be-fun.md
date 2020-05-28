---
title: Frontend used to be fun
description: An opinionated 10 years retrospective of the evolving landscape of frontend technologies.
timestamp: 1574467200000
---
<disclaimer>The original article has been retrieved from medium</disclaimer>

### Disclaimer

Those thoughts are mine, and you may disagree ; that’s ok. I’m not a god, and certainly not own the Truth. My background surely defines my views, and as we have all different stories, your opinion may differ.

I’ve no CS degree. Like many, I’ve coded since I was a teenager, and eventually ended up in the frontend world because I was passionated about the blend of art and tech. I naturally started my career doing flash websites, and since “the death of Flash” I migrated to JavaScript.

### A huge waste of time

ou may find my view narrow, but as a growing “junior” coder I used to live by the moto “a lazy developer is a good developer” or rather said “don’t do the same thing twice”. That moto still drives me, but with time I’ve learnt to temper it as I learnt [automation isn’t always worth it](https://xkcd.com/1205/).

Sticking to it and still to this day, I personally believe that what happened in the frontend scene is a huge waste of our time: in today’s world, we still barely achieve in frontend what we could deliver when I was 10 years younger. I personally think _business_ war killed Flash, as Apple would probably have lost its 30% share of app/game revenue if such a technology could run for free in their device’s browser ; it was nothing more than a trojan horse into their income plan, and they had no choice but to kill it.

3D accelerated graphics, video with DRM support, multi-lingual websites with blazing transitions, a typed-language out of the box, free IDE and compiler, you name it. This was all available for us to use, and it’s undeniable that [this era was the most creative decade for frontend development](https://www.vice.com/en_us/article/d3awk7/flash-is-responsible-for-the-internets-most-creative-era). This moment in time gave birth to [awards websites](https://thefwa.com/), boomed the web based game industry, popularized “motion designers” and “interaction designers” positions for the web, which eventually helped raising a global awareness about UX…even ad campaigns used to be amazingly fun!

When Apple pulled the trigger, the biggest mistake Adobe did was not to open-source the player (or the bytecode spec), which would have rendered the only valid argument of “owning the web with a closed source technology” void.

Adobe, this one’s on you.

### Reinventing the wheel, the political way.

So, Apple brings the iPhone into the world and claims that Flash is shit mainly out of business reasons: they said they can’t really control performances, and thus mainly because the player was closed-source. Of course, Adobe tried to help… but Apple wasn’t _really_ interested. The closed-source claim took off, and world-wide digital heat went on.

The argument alone sounds reasonable, but even if I was _somehow_ concerned about was not knowing about the internals of the Flash Player, as I was still young in the field, it was still acceptable to me because it was empowering me on delivering great content ; now with a little more experience, I can see I’d be way much bothered about it. I can understand why it mattered to so many people.

Of course, the other big names found their way into it. Google and others had their chance to influence the market, so they didn’t _really_ backed Adobe up and ultimately Adobe had to pivot its strategy towards HTML5.

But to what benefits and what costs?

#### The runtime

Hate it or not, while Adobe owned a closed source web content player, it took nearly 8 years (give or take) to stop whining about browser implementation differences in JavaScript.

After the death of Flash, I had to code for “IE7+” ; I know **this** time. Today our runtimes are Gecko, Chromium and Webkit, lead by organizations who also seats in the W3C. Of course this is a shortcut as some are independent open-sourced projects, but I do hope you can see the big picture: those organizations write the specs and implement the features in OSS repos.

This point is quite disturbing to me now, as I can see how one would implement a feature with an experimental flag and later force the hand of the W3C to consider it out of already spread popularity (like the recent Chrome XR api) – it’s no longer clear if the consortium is really objective, but it’s clear now that those who implement the engines and sit at the table won influence and the power to steer the spec towards their business goals.

##### An other runtime.

This part was also critical and changed the game forever: as Google made their JS engine "v8" available to the public (learn this Adobe), [one hell of a clever guy](https://en.wikipedia.org/wiki/Ryan_Dahl) elevated it to a server-side engine – [node.js](https://nodejs.org/) – opening the path to all the modern tools we know today. As this is mostly a server-side revolution, I’ll pass quickly on it, but it had an undeniable influence on what happened – more on that later.

#### The language

Typed language, a long-lasting hatred argument against JavaScript, took 3~5 years to seriously take off, as TypedScript is now a thing. ActionScript (3), while debatable and improvable, was ok good. It had it all: real interfaces, accessors, getters/setters, proxies, and all the other things we still trying to implement today. A saver move for Adobe should have been to try elevating it as the next ECMA standard instead going solo. [Some loved it so much that they’re still trying to make it land in a binary, similar to node.js](http://www.redtamarin.com/about/description).

Out of all the competing solutions Microsoft won the game, but of course many tried before them ; most failed because they took on implementing an other language rather than a downward-compatible superset of it. That was clever sight from MS honestly, and probably the most obvious reason of its success. Still, when I moved away from a AS3 I remember clearly missing types, but now that I’m used to that freedom I can’t even see myself going back to it ; because Typescript acts as a pre-bundling safeguard, its utility (limited to DX) is still quite debatable.

#### The features

Other creative things, such as accelerated 3D, a decent video player (with DRM support), or a canvas specification took years to land. To this day, it isn’t as performant/convenient as it used to be, and I won’t even start with Adobe’s Flash CS, which is still unmatched when it comes to creative content authoring and animation.

Of course, Adobe wasn’t _always_ doing it right. One would a be fool to say “Adobe Flex” and “mxml” were cool. Like most Flash developers, I used to hate it because I felt weird about having the view of my objects written in a markup language along with a script/style tags. It was far from perfect, but it was somehow the start of something visionary. Those who know this time can’t hardly deny the similarities with “Single File Components” or even component oriented libraries ; even now we can see the rise of "render-less components" somehow mocking what [mx:HTTPService](https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/rpc/http/mxml/HTTPService.html) used to be. At this time, markup languages were assimilated to lower-class frontend, and writing it for the flash platform had a really bad aura… For me, it just felt somehow wrong, but I now changed my mind about it (components ❤️):)

At this time, out all the persons I knew, all the projects I’ve seen, most of the people who were using Flex were producing UI with forms, and mostly came from a Java background.

### From “hacker” tech to “engineer” tech

One of the things which pushed me into organizing my thoughts and writing this article was this particular argument.

Not so long ago, I met with [Sacha Greif](https://twitter.com/sachagreif) in Kyoto and listened to some of his talks to get to know him better. In one of [his recent talk](https://www.youtube.com/watch?v=iOUFkFQQW5w) (around 3'50), one sentence particularly hit me. He said:

> […] because I have this theory that explains all the issues we had for the past couple of years ; and my theory is that JavaScript is slowly moving from one side of the spectrum [the easy tinkering jQuery “hackerish” side] to the other [the structured TypedScript “engineer” side].

This striked me as an extremely simple, but “straight-to-the-point” view of the evolution of our job.

#### What it meant to be a frontend guy

Frontend has _always_ been seen as odd. For a very long time in the frontend industry, you’d had 2~3 types of guys:

1. **Engineers** who were doing server-side generated UIs: they were comfy with their server language, and because most of those languages were more advanced than client-side technologies, they despised JavaScript and considered CSS as voodoo _(they still exist today)_

2. Few countries (including France) had **HTML Integrators**, who were basically HTML/CSS gurus, sadly spending the most of their time doing e-mailing out of `<table>` because mail clients were shitty _(they’re slowing going extinct)_

3. **Flash guys**, who thought themselves cooler than the rest because they were "closer" to design than the "black screen terminal" backend dudes, and were programming cooler things than the HTML/CSS crew _(they died)_

In short, for backend guys, we were that “non-engineer designer bff” ; for designers, we were “the black-screen coding boy”. Right in the middle, but never truely fitting: so was the job.

When doing Flash things, it was quite ok ; we had control over design _and_ code and UI could be well coded, powerful and rich in features, but still creative and fresh looking.

_Then_, when leaving Flash, you had to choose your side: either you’d be a CSS guy and cared about design stuff and cool rollover effects, or you’d be the JS guy and you’d find the best date-picker plugin for jQuery.

This contributed to a widely accepted thought that the mission of building UIs should now be separated into 2 parts: “the design” and “the code”, even if somehow Adobe’s ecosystem had succeeded into maintaining a fragile balance over the two and made it possible to work with each foot in both side.

While I’ve always been used to “quite advanced” development when writing ActionScript, the firsts years of going back to JavaScript were indeed painful: we had to support different browsers and tools to structure applications were to lack. It was the beginning of the JS era and instead of upgrading our JS eco-system, greater powers were trying to take over with initiatives like GWT or Dart. Some turned into Haxe or Processing and became “creative technologists”, but most embraced the pain of working with jQuery, or like me, coded as much “vanilla” as possible until the firsts tools arrived.

I remember clearly the [firsts build scripts](https://github.com/mrdoob/three.js/commit/e43af53f1947e45ff336d0969dcf08699f04a15d#diff-b2f5393233be2b890961001a9c2eff11) of three.js, simply concatenating files and minifying them, the arrival of backbone, but most of it, the arrival of node.js.

#### Engineers to the rescue

No wonder why, when node.js arrived, “real” server engineers mocked it. It was a client-side (non-typed) language in the terminal: can you imagine? Even nowadays there’s still a shade around node not being capable to scale as much as a php website or not secure as a Java application. It’s getting better of course but the language still lacks of an equivalent of Symfony, .NET, RoR, or Spring, somehow showing a lack of interest for such tool.

At the beginning of it, it opened a door for frontend people to, and share code with a package manager instead of _“relying on CDNs to include jQuery into their pages”_ and later on build command line tools. It naturally grew potentially as JavaScript was an easy language to learn. JavaScript was easier than ever, and the promise of a language which could run both in backend and frontend made a profound mark into company strategies to hire “fullstack developer”, a unicorn who could both handle database security and responsive design.

As more and more juicy job offers arrived, many powerful engineers were into it and JavaScript naturally grew more complex. They'd be interested "despite the shitty language" and spent time fixing it by creating amazing tools such as Babel or Typescript, which are today used daily by millions of people. They helped building the new modern web, and probably Medium too ; but as they grew bigger in number (for good reasons), they also had an influence about what UI should be.

The tooling turned into engineering, and what used to be a tinkering fun language has now created jobs like “Frontend Dev Ops” to counter the complexity of _maintaining_ a web application ; not to mention that this path doesn’t sound like the creative one Flash used to carry, ultimately leading to more “TODO-MVC” UIs and less of 2advanced polished quality. JavaScript owns now more "Java" than "Script".

### Frontend is boring

Few years ago, Polymer came from Google. It was one of the natural evolution of backbone, or more globally, a consequence of how the DOM is designed. After all, text inputs themselves are sort-of native components, so why not expanding the idea and give developers control?

Polymer wasn’t the first to implement the idea, but it’s interesting to see that it was the first to really implement the idea of web components – a concept brought by Alex Russel who also works at Google – which later on (surprisingly?) made its way into the W3C specifications.

Don’t mistake me: I think component-thinking is nice. It’s a good way to respect design and can have a variety of forms which makes sense for UX. The overall is a great thing. Single File Components are now a thing, _but isn’t it somehow what Adobe Flex used to be?_

Again recently, Google released a new technology draft (which also contributed to my reflexion around this article): the [web bundles](https://web.dev/web-bundles/).

The idea is nice: bundling a web application into a single, sharable file ; there’s even a extension for it: `.wbn`. _But isn’t it exactly what a swf file used to be?_

**It appears to me clearer than ever now that we’re coming back to where we were. My only regret is the cost of it. It’s been around 6 years of struggling to see that we’re not quite there yet, all because Apple was greedy, Google was lurking and Adobe decided to keep closed source a powerful piece of technology ; our services and the quality of life of our users went technologically frozen in time due to private greed, despite of all "user-first" public policy advertised by those tech giants.**

### A way out?

There’s probably a way for those who wants to get back to where the things were, with the benefit of those 10 years of “wisdom” on top.

I didn’t mention it before, but one of the latest feature Adobe added to the Flash platform before dying as the capacity to compile “native” code: with some effort, you could add some libopengl to your swf file (so was AR in 2005).

It’s not surprising to see that if Adobe recognized that developers could leverage "good old C" libraries to push further the web experiences, in the very same fashion, our “evergreen” browsers recently started to do the same and have WebAssembly running wide.

[Some made online petitions for Adobe to release the specs](https://github.com/open-source-flash/open-source-flash) for a while, but somehow the company didn’t respond to it. The hope to reimplement the flash player in Web Assembly is thin, but still alive. More recently [some others decided to bring the flash player as a wasm module without recompiling it](https://medium.com/leaningtech/preserving-flash-content-with-webassembly-done-right-eb6838b7e36f).

It’s funny how things turned out. The flash player was banned of the world because Apple decided that it wasn’t “performant” enough, and pushed HTML5 to become a powerful standard on the way ; all that to see WebAssembly as the unexpected trojan horse to reimplement the flash player back in the browser again.

I wished that it didn’t waste 6 years of everyone’s time, but it’s hopeful.

Hopeful for fun content again.

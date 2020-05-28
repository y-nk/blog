---
title: Understanding MVC
description: The journey through building a small MVC framework
timestamp: 1316098800000
---
<disclaimer>The original article has been retrieved from the internet archive machine and edited for fluidity.</disclaimer>

I recently been assigned to a project with enough time and the perfect sized scope to build myself a small php MVC framework. At the time of writing, the only competitor is _lemonadephp_, but what's not to love about making your own thing and learn on the way?

I had the chance to work with great people before and had lots of talks about the zend framework and symfony ; I had heard a lot about their processes, their pros and cons but it's something to know and it's an other thing to actually _experience_ it, right? Plus I didn’t get the point with using those big engines for small/medium projects.

TL;DR? It was a good time for me. I enjoyed a lot scratching my head on problems that i knew Zend or Symfo writers had. About the structure, about performances. And since I'll always feel newbie with programming, I didn’t really cared about the time I spent.

### A journey to "hello world"

As I went from a blank directory, I structured my project humbly.  
A `src/` folder for my code, a `lib/` folder for my framework's files, and a `www/` for assets and such. 

After that, I've been using my usual technique: write down how you want to use your library, and fill the insides after.

So with webserver, it all starts with an `www/index.php` which is usually your single entrypoint and there's a function to call to startup the server. `App::dispatch` will do. To make sure the routing works, I added an .htaccess file which redirects any non-physical request to the `index.php` file.

`App::dispatch` has a simple job. 

1. Parse the url
2. Find the controller/action to call
3. Call it

The parsing strategy is quite ABC of programming, involving a lot of split string and `if file_exists` statements.

As I was going on during this journey, a _tiny_ change of plans came to my attention. The client suddenly bought the admin panel for its website, so I was now forced to handle "multiple applications" (as in, separated, siloted source code and assets).

Since I didn’t know the best way to link urls to specific applications, I built a simple file called “config.php” containing an associative array describing the relationship between urls and applications. I moved the `src/*` to `src/front/` and created a `src/admin/` to host my second app.

**When you don't really know what you're doing, better keep your moves simple to reverse.**

Finally I could go back to the app's process. When the time came to define how the framework would call action functions, I started to understand why frameworks have classes and why they suffixes controllers and action names: they probably needed to avoid multiple definitions that could occurs between lib code and app code and couldn’t be under control.

I'm not the type to love big structures, with controller being class-made objects and actions being methods ; it always looked heavy to me. As I’m a wordpress fan (because it's simple), I decided to use the file's name as controller and simple functions as actions.

I made a convention of having a `controllers/` folder inside each app (as in `src/front/controllers/` for the front, and same for the admin).

I only had to have `function index($params = null) {}` in my `src/front/controllers/index.php` file... and it was working! YAY! After that, all was easy :)

### Pimp my app

I added a functions.php file which acted as a starter file of each application and thought about implementing those _pre_ and _post_ dispatch concepts I learnt from my talks with my friend _panosru_.

I also changed the config.php file to a declarative format and used xml that would be parsed automatically... MUCH easier for consumers (and also inspired by the Zend’s ini file).

I still ask myself if xml is the best format. I still prefer it from others because you can define values and attributes related to it but I could consider using json, yaml or ini too.

[@Danetag](https://twitter.com/Danetag) told me a long time ago about ORM, at the time he went crazy about Doctrine and shit. I wanted to try myself, something more humble of course.

I wrote a first `Model` object that would contain all the logic of a single abstract model object. I thought it was logic to have a static “get” method, since any model object should perform a get action to a database. Then, the instances should be able to be saved or deleted. The save method should know if an insert or update query should occur (the `insertOrUpdate` kind).

I went for few dozens of lines of code and while the implementation was working fine, I was too deep in the code to see that I would had to call a static `Model::get` any time I would need to get something. After few days I kinda thought it'd be painful to extend this method since it's a static one and static are usually not inheritable metho... **except in php, they are** :) It’s still a strange and disturbing thing to me but it looks like php like it this way since it’s still working wih php6.

I’m still not able to make NN requests and I’m not that confident with performances, but as a material for learning, I really enjoyed what I did.

Most of all, I learnt a lot about framework structure and demystified this huge concept which scared me when I joined backend conversations. If you never did it yourself, I highly recommend you to try this journey into learning.

You’ll be put in front of choices some others had to take before, you’ll go through some states of mind which they probably had and you'll have to make decisions, and maybe why not you'll decide differently from them. If the timing is good, go try yourself and you’ll understand what i meant ;)

I’m currently re-writing the url parsing to let the coder choose the url pattern.
I also want to taste the difficulty of i18n better than the current try (aka ‘DIY’).

[I've put my code on github so if you give it a try, feel free to file some issues](https://github.com/y-nk/apt). _(Don’t be rude, it’s a 0.1 alpha :) !)_
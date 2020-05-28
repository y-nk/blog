---
title: HTML should be meaningful
description: Thoughts on the evolution of my POV on HTML and CSS
timestamp: 1349276400000
---
<disclaimer>The original article has been retrieved from the internet archive machine and edited for fluidity.</disclaimer>

It’s been a while ’til the last post, as always :/ I’m more and more involved into javascript and dom manipulation. For years i’ve been playing around html, seeing arrival of xhtml and html5, and i’m now surprised how far it went and how much my new workmates are lacking of basics.

<strong class="!">Disclaimer</strong> : This is me about to vent on _frontend_ devs lacking of fundamentals.

### How I changed my point of view since 2008

HTML is a markup language. It has been created to structure documents and litteral contents to help describe what is what in a document. It's been also used so the machines could know what a title or a link means for human beings.

It’s still used that way, but now search engines are the primary readers of those tags. At least, that's how we consider writing HTML for nowadays. We now only _feel_ the tags thanks to the CSS, but a tag that *looks like a title* should still be meant to be a title ; not a div, not a link.

The first task involved in writing a document should be... writing the document. Structure the content. Create a file that could be seen as a book, when removing its stylesheet. Make it consistant, readable.

That said this feels like an exception ; Why are most of my colleagues writing stylesheets along their markup rather than after?

It could be because there’s no time to separate tasks. But then a good and minimalist markup is easier and more consistent than something that could be kinda incoherent. Like putting 5 levels of divs because of a margin that can’t be dealt with – and I won’t talk about the goddamn bootstrap and its DOM _towering_ style...

Or it could be because they don’t know/care.

When you build a good markup, I believe the styling is easy to do. Being there for few years now, I've been CSS evolve and there’s so much properties nowadays that you (almost) never have to hack it. Sometimes, you may have to add some extra markup to glue tags together, to fit to some design ; but it’s only an **adaptation**. It’s minimal and never should it be intrustive.

Being an HTML/CSS developer also means you have to know your material. What is a title or a paragraph, its default properties, or even its origins: is a `<strong>` tag just a span with `font-weight: bold`? [What are the default margins of a `p`](https://stackoverflow.com/a/2787324/335243)? What is _the flow_ how and what are the situation where it's ok to get out of it? What are the benefits?

I'm not that old in the web. I've been coding for 12 years as hobbyist, and got paid the last 4 years of them. **I remember a time where browsers were real shit. Not a gecko/webkit war shit. An IE6 shit.** 

At that time, people were building some basics css that later has been known as _reset.css_ because of this shit. It was so difficult to come around that you _had_ to know _everything_ about CSS (also one may argue, there was less to know about... feature wise it's true, but in the real world... oh my.)

**I knew what it meant and exactly what it did. People nowadays just use things without this knowledge, assuming this will work the way it was intented to. They don't really question what's told about what they use.**

Lately, everyday or so, i'm not convinced anymore that younger generations of HTML/CSS developers understands that a reset stylesheet is still **optional**, that **it belongs to fixing a compatibility situation**. It now became a standard – which could be right if people didn’t stop knowing what it is. That’s why I usually encourage anyone who ask to build their own reset.css : to know what it does (even if those people will probably use a popular one after) But then it feels more now like a _"i don't really care, i just put it because it's how it should be done"_.

Writing a clean css also means to be smart when building your _entire_ website.

Due to smart libraries and cms’, _class overflow_ has been understood and now it’s not rare to see elements with multiple classes and it’s a good thing :) People prefer that to inline styling (and so do i) and that’s great!

On the other hand, while I was talking with more junior developers, it appeared to me that they didn't really understood what class overloading was. Most of them described it as "you put a 2nd class and it combines with the first one", which while being a somehow accurate observation doesn't consistute a good definition ; that there's a tight relationship with programming and OOP.

Maybe they were lacking of basics of OOP. Courses on CSS don't really provide that.

Then it comes the time of the sibling’s priority problem. Using composition, and overriding with edge cases is a very good practice. A better one would be to know when to write a very strict sibling and when to be more lazy about it, to add more flexibility. There’s no real rules around this, the best one would be to think **macro and facto** and try to avoid duplicates or multiple overrides in declarations.

It seems like the _art_ of writing clean HTML/CSS has became rare, replaced by more frivolous things such as the amazing transitions of css3 (which I love too) ; as if people were writing words decorated with angle brackets without thinking further or reading a documentation to know what is possible, what is the real use of what they play with. It seems like design took first place, and css is now the first think to master, since (and I quote) "html is just dumb tags".

**But HTML is the soul, and CSS is merely a body.**  
**Isn’t it what ZenGarden was all about?**  
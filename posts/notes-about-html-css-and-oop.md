---
title: Notes about HTML CSS and OOP
description: CSS as OOP and other thoughts about how to tidy a project
timestamp: 1214924400000
---
<disclaimer>The original article has been retrieved from the internet archive machine and edited for fluidity.</disclaimer>

Here are some thoughts about HTML, CSS and JS and how I'm growing to see them.

### HTML

There's no big revolution in the way I apprehend HTML. It is and will always remain a semantic markup and nothing more.

It's probably a shame but nowadays I can't even recall the last time I saw an HTML page without a CSS linked to it. If we are to import a stylesheet, why bother using tags if we can use divs and spans? Aren't they generic enough to serve most of the purpose? Probably a `<a>` would need Javascript to be properly emulated, but even though it could be done.

SEO and others shouldn't really sit on tags, rather on a dedicated set of attribute since it's easy to abuse a tag to be something else than it should anyway, and we'd flatten all tags accross browsers (especially IE<=6). So yeah, why not all `<div>`/`<span>`/(`</a>`)?

### CSS

From most of my time with engineers, I can see CSS being underrated and considered as voodoo rather than something with logic, which it has. They copy/paste, duplicate style, override on override with multiple declaration blocks and overlapping selectors which they don't really care about.

It seems to me there's a way to tidy. Class overloading has been to me quite a revelation while learning OOP. At first, I wouldn't _really_ understand but since I've learnt composition and polymorphism through interfaces it really grew to me.

Take a simple example of 2 buttons, being green and red.

OOP suggests you could create a `Button` class and make children classes like `RedButton` and `GreenButton` ; and if you were willing to add a size effect to it, would you continue and create `SmallButton`, `BigButton` and `BigRedButton`, `SmallGreenButton` etc? (of course you could make them a property, but let's think Java and that it's more than just a prop)

In CSS, the translation would probably be something along:

```
button { border:1px solid black; background: transparent; }
redbutton { border:1px solid black; background: red; }
greenbutton { border:1px solid black; background: green; }
```

An other way to approach CSS is also to consider class overloading as a way to compose, just like you'd do with interfaces. For my example, then you'd create a class `Button` and have PrimaryButton which is composed of interface `RedBackground` (and later `BigSize`).

```
button { border: 1px solid black; }
red { background: red; }
green { background: green; }
```

Well, that's it?

Thinking this way breaks down CSS properties to the smallest possible unit, making them reusable everywhere and leverage fully the principle of class overloading to start writing style directly from HTML and (completely) stop writing CSS.

For the record, with that example, nothing stops me from writing `<div class="green" />` and that'd be completely fine.

With this technique, I use a set of 4 stylesheets which (to me) compose the 4 necessary layers of a style.

#### 1. Definition stylesheet

This stylesheet is mainly to define width, height, margin and padding only. Positions come as a separate spreadsheet, but I'll explain it later.

You define the blocks of your websites and how they occupate the screen, and that's pretty much it. It's quite easy to translate from a photoshop/jpg design so it'll be easy to write.

This brings me to talk about a small hack that I find quite nice: if you want to define container sizes with padding, you'll notice that padding does change the size, so you'd need to calculate `width: real with - padding`. Even though, padding would not constraint the content in the block and sometimes the content would _push_ the rest of your page... but it doesn't if you use margins :) So, you can use a `.container * { margin-left: 10px }` with `.container * * { margin-left: 0 }` : the first selector will add the corresponding margin to all the children, while the 2nd will stop propagation to further children of the tree. or simply `.container > *` if your browser supports it.

#### 2. Positioning stylesheet

With the flow being a bitch, and behaving differently on many browsers, it's quite useful to branch out of the flow when necessary and use a combination of `position: relative` on the parent and `position: absolute` on the target to place it as needed by the design. It's breaking the flow, but it's cross-browser proof.

With: 

```
<body>
  <div class=”parent”>
    <div class=”enfant” />
  </div>
</body>

<style>
  body { position:relative; }
  .parent { position:absolute; }
  .enfant { position:absolute; top:5px; left:5px; }
</style>
```

Everything is about parenting. By adding `position: relative` to the `<body />` we ensure at least all absolute children will have an origin point which is the top left of the window.

Having this propagated to other nodes, we move the origin point of nodes' children as the node's own position. Just like that we have a simple-to-master 2D coordinate system which do not bitch around like float or whatever. It's worth noticing that using this way, we can use the `top/right/bottom/left` for dimensions rather than `width/height` as well, since it's a way to define implicity fluid dimensions by constraint. Even though nobody uses that anymore...

#### 3. Styling

Until here, bounding boxes only were defined. I work with UX designers and we do wireframing a lot, and they like that I can deliver a cross-browser skeleton page without design, so it's a bonus. 

This one adds the design and it oriented towards "the smallest meaningful block of style you can reuse". If it's a single property, let's do it. If it's bigger, it's equally good. Basically, all `background`, `borders` will go there. Nothing related to font though.

#### 4. Fonts

I feel like the split of 3. and 4. could be optional, but I do recommend it anyway. There are classes for titles, subtitles, paragraphs etc. Basically, `.h1`, `.h2`, `.p` but in a design sensitive way.

--- 

With the use of those 4 spreadsheets, we can define a single meaningful property to be reused in html, while also being capable of defining design oriented blocks clean.

From experience, designers usually come to ask "can you change the titles color?" or "can you move this block to the left by 1px? and this one by 5px?" so splitting the stylesheet this way makes sense.

I also found that blocks are usually implicit within a context. You could have a product which has different representation in the cart of a e-commerce website, or in a list, or in a carousel.

It becomes quickly unbearable to find class names for those, like `.CartProduct`, `.ListProduct` or `.CarouselProduct`, so why not contextualize with selectors instead and abstract the common properties, so we can factorize some CSS on the way?


```
<div class=”module cart”>
  <div class=”product” />
<div/>

<div class=”module list”>
  <div class=”product” />
  <div class=”product” />
  <div class=”product” />
</div>

<div class=”module carousel”>
  <div class=”product” />
</div>

<style>
  .module { /* module common properties */ }
  .product { /* product common properties */ }

  .module.cart .product { /* product properties for within the cart only */ }
  .module.list .product { /* product properties for within a list only */ }
  .module.carousel .product { /* product properties for within a carousel only */ }
</style>
```

This ensures strict selectors with meaningful paths, but still does not over define selectors in a way which could be cumbersome. It's the perfect balance between too strict and too shallow which allows to take advantage of class overloading. 

### JS

There's nothing really special related to JavaScript, at least that I understand of right now. I only think useful to share a few functions I wrote to manipulate the classes which come along the big talk on CSS :)

```
function hasClass(ele, cls) {
  if (ele.className != undefined) {
    // 2020 EDIT: why didn't i think of className.indexOf(cls) !== -1 ?
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }

  return false;
}

function addClass(ele, cls) {
  if (!hasClass(ele, cls))
    ele.className += " " + cls;
  }
}

function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

function toggleClass(ele, cls) {
  if (hasClass(ele)) { addClass(ele, cls); }
  else { removeClass(ele, cls); }
}

function getElementsByClassName(root, cls) {
  var elements = root.getElementsByTagName("*");
  var returnElements = [];

  var current;
  var length = elements.length;

  for(var i=0; i < length; i++) {
    current = elements[i];
    
    if(hasClass(current, cls)) {
      returnElements.push(current);
    }
  }

  return returnElements;
}
```

With that, we can create and think of behaviors such as mouseenter/mouseleave toggling a `.hover` class, or targeting `.link` to add a navigation behavior onclick.

I hope these views helped you to understand more about the way I code and the way you should code too. It allows to get rid of browser differences and flow related bugs by sticking to the basics of generic tags while leveraging power of css overloading to compensate for the loss, and javascript to the rescue to support the things we miss.
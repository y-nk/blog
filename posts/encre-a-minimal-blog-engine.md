---
title: Encre, a minimal blog engine
description: Build your blog in seconds, customize in minutes. 
timestamp: 1591142400000
---
I've been trying for years to maintain a blog.  
It's always too much of a hassle, isn't it?

At first there was Wordpress. You'd need php, a proper DB for comments and article versions... Even though it was working great, at least until you'd need plugins not to get hacked. Migrations were painful, and theming – while being extremely versatile – is still so complex that it could be a path of career.

JAM stacks rised up, slowly and solutions such as [Jekyll](https://jekyllrb.com/), [Hugo](https://gohugo.io/) and [Gatsby](https://www.gatsbyjs.org/) came by. Today,  there's so many offers that we even need [a website to reference them all](https://www.staticgen.com/).

---

When talking with friends about old articles, it kinda pushed me once more in the quest to revive my blog. There were 2 choices:

1. Spend some days trying suitables JAM solutions and decide which one to go with hoping it would be customizable enough yet simple enough not to get me discouraged

2. Craft a quick and dirty "bare metal" prototype and improve it as seen needed, until I wouldn't need any other feature

**I had an index page running in a dev server and built into a static page within 2 hours. That's as much as I needed to get convinced to push further.**

### Encre

What the name? Well, it's french for _ink_ and that's the proper way to pronounce my handle, so there's that. Also it's [always such a hassle to name things](https://twitter.com/codinghorror/status/506010907021828096).

Encre is a ridiculously small blog engine. It'll inject markdown files into html templates. Nothing more, nothing less.

It hasn't been made to compete with giants like gatsby but rather only to fit my needs about how to build a simple blog and sometimes hack into it.

### Setup

The installation process is quite simple since I've been shamelessly use npm for myself, publishing this tool as a package.

```
npm install encre
```

You'll have to create a minimal filesystem structure. You can do so by typing:

```
mkdir {layouts,posts,static}
```

You'll also need a main template. Run `touch layouts/index.html` and later add:

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <title></title>
  </head>
  <body>
    <div id="main"></div>
  </body>
</html>
```



- The `posts` directory is where you'll put your `.md` files.

- Your `layouts/index.html` will serve as default layout and must contain a `#main` node where the dynamic part will be injected.

- _Optionally_, you can have a separate `/layouts/post.html` template file for single posts.

**That's for the setup.**

### Development server and build

The package exposes two commands which you can use in your `package.json`.

- the **draft** command will spawn a simple express server on port 9999 for you to write locally
- the **write** command builds your files into `dist/`

You can invoke them directly using `npx` with `npx draft` and `npx write` or you can put them in your npm scripts to link with other steps:

```
{
  "name": "blog",
  "version": "1.0.0",
  "scripts": {
    "serve": "draft",
    "build": "write"
  },
  "dependencies": {
    "encre": "1.0.6"
  }
}
```

**...and that's for the build.**

### Authoring

There's nothing very special to know about it. Markdown files will be parsed using [marked](https://www.npmjs.com/package/marked), with metadata extracted from [gray-matter](https://www.npmjs.com/package/gray-matter).

Those metadatas only exist to be given to your custom templating functions. There's no mandatory fields or whatsoever. 

The url of the markdown will be the `${filename}.html`.

As an example, you can create `posts/my-first-post.md` and write down:

```
---
title: My first post!
---
yay \o/
```

### Templating

The two commands `draft` and `write` can take exactly one argument, which is the path to a js file made for customization.

Let's call it `renderers.js`

You can modify your npm scripts accordingly:

```
{
  "scripts": {
    "serve": "draft renderers.js",
    "build": "write renderers.js",
  }
}
```

Once this is done, your `renderers.js` file can export few functions to customize the output of your pages.

#### • head(document: JSDOM, metadata: object): void

If you create an expose this function, it will be used as a hook to modify the `<head>` tag of a page. The function receives the full document as a JSDOM object and the metadata collected from gray-matter.

As an inspiration, the default function for this renderer is:

```
const head = (document, data = {}) => {
  const { title = '' } = data
  document.title = title
}
```

#### • index(metadatas: PostMetadata[]): string

This renderer is dedicated to the list of posts which is in your index file.
The metadata objects contain the metadatas from gray-matter for each post.

A simple example of customization would be:

```
const index = metas => (`<ul>
  ${ metas.map(({ link, title }) => (`<li>
    <a href="${link}">${title}</a>
  </li>`)) }
</ul>`)
```

#### • title(metadata: object): string

This last customization option allows you to generate the title block of a page from its metadata. It will be injected before the content of the markdown.

You could use:

```
const title = ({ title }) => `<h2>${ title }</h2>`
```

#### Putting it all together

In `renderers.js`:

```
const head = (document, data = {}) => {
  const { title = '' } = data
  document.title = title
}

const index = metas => (`<ul>
  ${ metas.map(({ link, title }) => (`<li>
    <a href="${link}">${title}</a>
  </li>`)) }
</ul>`)

const title = ({ title }) => `<h2>${ title }</h2>`

module.exports = { head, index, title }
```

**And voila :)**

Since the index and title function expects you to take data in input and output a string, you can easily decide to [use React and render to string](https://fr.reactjs.org/docs/react-dom-server.html) your components (although it feels really overkill).

### Build optimization

The build will output the files in `dist/`, leaving them for you to minify, bundle or whatever it is you need to do.

I personally minify the html with [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser) and css files with [cssnano](https://cssnano.co/) before publishing to github pages with [gh-pages](https://www.npmjs.com/package/gh-pages)

For a complete example, you can check [the repo which hosts this page on github](https://github.com/y-nk/blog/). Otherwise, [encre's source code is also available on github](https://github.com/y-nk/encre/).

### And more!

This only covers the basics, but know that there's also the support for an atom feed as well as tags. Check the github page for more up to date details!

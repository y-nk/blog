---
title: Dynamic alpha
description: Observations on obstruction of background and what we can do about it
timestamp: 1311519600000
---
<disclaimer>The original article has been retrieved from the internet archive machine and edited for fluidity.</disclaimer>

Since early 2010, coverflows have appeared everywhere on the internet. They're considered one of the best way to show lots of things in a small space, thanks to their hidden "slides".

Most of the time, you can expect a simple box with an image, and a overlay with a semi-transparent black background and white font color. Just by saying it, you can smell the shit happening and despite your tries to educate your client about it, most of the time what you predicted becomes reality.

With a bright image, if the black background is too opaque, you hiding some parts of the image but you also change the perception you had about shape of the image. If the black background is too transparent, you may find the white font unreadable very quickly.

So I went up with this stupid and almost useless idea to adapt the alpha of the background depending on what’s behind. That way, wherever the overlay could be, the alpha would always be the way it should to provide a good compromize between the visibility of the image and the readability of the font.

For a small proof of concept, i just put 4 greys and tried differents overlay. To see what i meant with visibility and readability, i made those overlays draggable:

<style>
#container-1 {
	display: flex;
}

#experiment-1 {
	position: relative;
	margin: 2em auto 2.5em;
}

#experiment-1 canvas {
	display: block;
}

#experiment-1 div {
	position: absolute;
	padding: 2px 4px;
	background: rgba(0, 0, 0, .5);
	color: #fff;
	user-select: none;
}
</style>

<div id="container-1">
	<div id="experiment-1">
		<canvas></canvas>
		<div rel="futsu" style="left: 30px; top: 60px; background: rgba(0, 0, 0, .2)">Non Adaptive (.2)</div>
		<div rel="futsu" style="left: 175px; top: 100px; background: rgba(0, 0, 0, .8)">Non Adaptive (.8)</div>
		<div rel="smart" style="left: 140px; top: 225px; background: rgba(0, 0, 0, 0)">Adaptive</div>
	</div>
</div>

<script type="text/javascript">
	;(() => {
		const container = document.querySelector('#experiment-1')
		const overlay = container.querySelector('div[rel="smart"]')
		const canvas = container.querySelector('canvas')
		const context = canvas.getContext('2d')

		canvas.height = canvas.width
		const w = canvas.width  * .5
		const h = canvas.height * .5

		context.fillStyle = '#333'
		context.fillRect(0, 0, w, h)
		context.fillStyle = '#666'
		context.fillRect(w, 0, w, h)
		context.fillStyle = '#999'
		context.fillRect(0, h, w, h)
		context.fillStyle = '#ccc'
		context.fillRect(w, h, w, h)

		const refresh = () => {
			const x = parseInt(overlay.style.left)
			const y = parseInt(overlay.style.top)
			const w = overlay.clientWidth
			const h = overlay.clientHeight

			const { data } = context.getImageData(x, y, w, h)

			let average = 0
			for (let i = 0; i < data.length; i += 4)
				average += data[i]

			average /= (data.length / 4)
			const opacity = .2 + (average / 255) * .6
			overlay.style.background = `rgba(0, 0, 0, ${opacity})`
		}

		refresh()

		let active = false
		container.addEventListener('mouseenter', e => active = true)
		container.addEventListener('mouseleave', e => active = false)

		document.addEventListener('mousemove', e => {
			if (!active || e.buttons === 0)
				return

			if (!e.target.getAttribute('rel'))
				return

			const target = e.target

			const x = parseInt(target.style.left) + e.movementX
			const y = parseInt(target.style.top) + e.movementY
			target.style.left = `${x >= 0 ? x : 0}px`
			target.style.top = `${y >= 0 ? y : 0}px`

			if (target === overlay)
				refresh()
		})
	})()
</script>
  
I turned to be usefull with a real image.

Here, i put the .8 alpha overlay on dark side but onto bright details, which are lost behind the overly black background ;  the .2 alpha overlay on a bright area to show that a too transparent background could affect the readability of a text. The perfect case would be to switch them but… we can't always predict which image will be loaded in a carousel. Hopefully, the dynamic overlay fits everywhere correctly !

<style>
#container-2 {
	display: flex;
}

#experiment-2 {
	position: relative;
	margin: 2em 0 2.5em;
}

#experiment-2 canvas {
	display: block;
	width: 100%;
}

#experiment-2 div {
	position: absolute;
	padding: 2px 4px;
	background: rgba(0, 0, 0, .5);
	color: #fff;
	user-select: none;
}
</style>

<div id="container-2">
	<div id="experiment-2">
		<canvas></canvas>
		<div rel="futsu" style="left: 570px; top: 70px; background: rgba(0, 0, 0, .2)">Non Adaptive (.2)</div>
		<div rel="futsu" style="left: 175px; top: 100px; background: rgba(0, 0, 0, .8)">Non Adaptive (.8)</div>
		<div rel="smart" style="left: 140px; top: 225px; background: rgba(0, 0, 0, 0)">Adaptive</div>
	</div>
</div>

<script type="text/javascript">
	;(() => {
		const container = document.querySelector('#experiment-2')
		const overlay = container.querySelector('div[rel="smart"]')
		const canvas = container.querySelector('canvas')
		const context = canvas.getContext('2d')

		const ratio = () => canvas.clientWidth / canvas.width

		const image = new Image()
		image.src = './images/dynamic-alpha.jpg'
		image.onload = () => {
			canvas.width = image.naturalWidth
			canvas.height = image.naturalHeight
			context.drawImage(image, 0, 0)
		}

		const refresh = () => {
			const r = ratio()
			const x = parseInt(overlay.style.left) * r
			const y = parseInt(overlay.style.top) * r
			const w = overlay.clientWidth
			const h = overlay.clientHeight

			const { data } = context.getImageData(x, y, w, h)

			let average = 0
			for (let i = 0; i < data.length; i += 4)
				average += data[i]

			average /= (data.length / 4)
			const opacity = .2 + (average / 255) * .6
			overlay.style.background = `rgba(0, 0, 0, ${opacity})`
		}

		refresh()

		let active = false
		container.addEventListener('mouseenter', e => active = true)
		container.addEventListener('mouseleave', e => active = false)

		document.addEventListener('mousemove', e => {
			if (!active || e.buttons === 0)
				return

			if (!e.target.getAttribute('rel'))
				return

			const target = e.target

			const x = parseInt(target.style.left) + e.movementX
			const y = parseInt(target.style.top) + e.movementY
			target.style.left = `${x >= 0 ? x : 0}px`
			target.style.top = `${y >= 0 ? y : 0}px`

			if (target === overlay)
				refresh()
		})
	})()
</script>

```
var rect:Rectangle = new Rectangle(overlay.x, overlay.y, overlay.width, overlay.height);
var ba:ByteArray = image.bitmapData.getPixels(rect);

ba.position = 0;
var total:uint, color:Array;
while (ba.position < ba.length)
{
	color = int2rgb(ba.readUnsignedInt() - 0xff000000);
	total += color[0] < color[1] ? color[1] < color[2] ? color[2] : color[1] : color[0];
}

var average:Number = (total / luminosity.position) / 100;
var ratio:Number = total / (0xff * luminosity.position);

overlay.refresh({ text:'dynamic alpha (' + average.toFixed(2) + ')', alpha:average })
```

<disclaimer>The original code was for AS3, so here's a HTML5 canvas version</disclaimer>

```
const getOpacityForRegion = (context, x, y, w, h, min = 0, max = 1) => {
	const { data } = context.getImageData(x, y, w, h)

	let average = 0
	for (let i = 0; i < data.length; i += 4)
		average += data[i]

	average /= (data.length / 4)
	return min + (average / 255) * (max - min)
}
```

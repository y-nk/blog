---
title: The power of Flash in Illustrator… at most!
description: Tips around using Adobe PatchPanel to enhance Illustrator CS3 authoring experience
timestamp: 1349276400000
---
<disclaimer>The original article has been retrieved from the internet archive machine and edited for fluidity.</disclaimer>

Experienced designers probably already know that you can script Illustrator with ExtendedScriptToolKit (ESKT) and Javascript, thanks to a DOM tree-ish structure created by Adobe. That said, since Adobe CS3 we can also see some cool richs panels (such as Kuler) made in Flash too.

Patchpanel is a tool created by Adobe to use AS3 to create panels for the Create Suite 3 and 4. It's still a beta, approaching slowly a v0.8. Similar to [SwitchBoard](http://labs.adobe.com/wiki/index.php/SwitchBoard), it consists of a SWC library with a bunch of objects we can use to interact with the host application (Illustrator, but not only).

There are 4 versions of this library: one for each version of CS (3 & 4), but also one per OS (Win & Mac). It's honestly quite confusing but hopefully the way you use the code is similar accross all 4.

It's a super cool tech. I think for digital agencies willing to invest time, you can definitely create tooling which fits your team, so there will never be a "I wished I could do this in Illustrator but I can't" anymore.

I thought this would be the perfect tool to help my current team. It's really common that UX designers would work on the same big illustrator sitemap separately, and then book a day long meeting to merge their work later on. I thought that, with PatchPanel, I could bring collaborative editing into Illustrator, saving them time.

I first drafted the concept of having a small [red5 server](http://osflash.org/red5) and some [SharedObjects](http://livedocs.adobe.com/flash/9.0/ActionScriptLangRefV3/flash/net/SharedObject.html), 
and replicate the 2 DOMs of the documents. They'd be 2 files, but linked through a server. Sadly, after some research on PatchPanel, I found that I couldn't really listen to user events related to selecting/deselecting an object.

Instead I've decided to downgrade the scope of my project to a simple chat application where users could also have a "transmit" button to send a shape over the network. A bit like a network-capable copy/paste :)

### Find the selection

It was probably the most painful part. The documentation says to use:

```
Illustrator.app.selection:Object;
Illustrator.app.activeDocument.selection:Object;
```

I've dug deeper into Adobe's website until I found [Illustrator's JS scripting documentation](http://www.adobe.com/devnet/illustrator/pdfs/illustrator_scripting_reference_javascript.pdf) ; the kind of document you _really_ need when working with PatchPanel, since somehow PP is just a bridge back to this technology.

The JS documentation is _slighlty_ more precise:

```
Illustrator.app.selection:Object > Array of Object;
Illustrator.app.activeDocument.selection:Array > Array of Object;
```

After few calls to `describeType`, I went for the bare minimum:

```
<?xml version="1.0" encoding="utf-8"?>
<mx:Application xmlns:mx="http://www.adobe.com/2006/mxml">
  <mx:Script>
  <![CDATA[
  import com.adobe.cs3.Illustrator.*;
  //import com.adobe.cs4.Illustrator.*;

  private function click():void {
    csl.text += "active doc selection : " + Illustrator.app.activeDocument.selection + "\n";
    csl.text += "illustrator selection : " + Illustrator.app.selection + "\n";
  }
  ]]>
  </mx:Script>

  <mx:TextArea width="100%" height="100%" id="csl" />
  <mx:HBox width="100%">
    <mx:Spacer width="100%" />
    <mx:LinkButton label="trace" click="click()" />
  </mx:HBox>
</mx:Application>
```

I searched for days until I almost gave up. I went to Adobe's forum about PatchPanel to report my issue, which stayed unanswered for some days. About a week after, a guy named "Bernd Paradies" – whom I assume worked in the PP team – answered that what I reported was not an issue, rather an undiscovered bug (and that he'd found others related to it).

So I've been instructed into a workaround which I wouldn't have been able to pull myself. I'm pretty novice with working with namespaces so it wasn't so natural to me, although it was quite simple.

```
import com.adobe.PatchPanel.patchpanel_internal;

private function getSelection(obj: IllustratorHostObject): Array {
	// enables the access to PatchPanel's hidden HostObject functions like $get()
	use namespace patchpanel_internal;

	// The following line tells PatchPanel's glue code to return an Array (not an Object).
	return obj.$get("selection", Array);
}
```

I only reshaped the function and made it a static getter function in some utilitary class, but you get the gist.

### Cloning an object

Visual object in an Illustrator document list :

- **PageItem**: a kindof abstract object, root of all of others
- **PathItem**: a simple path with the path tool
- **CompoundPathItem**: an object gathering many paths (an array of paths?)
- **MeshItem**: a gradient
- **TextFrame**: a text block
- **GroupItem**: an abstract group of object (that cmd+g in Illustrator)
- **RasterItem**: a rasterized view of an object
- **PluginItem**: not really sure yet. Probably a vectorized drawing made with Livetrace.

The doc has the following:

```
toSource():String > a script to reproduce the object
```

Aweso... well not really. Whenever I call it, it always returns `({})`; but `.toString()` works!

I didn't push through trying with the namespaces available, but i do hope it helps (i'll dig that later, probably)

I've been abusing `.toString()` to collect all meaningful properties for each of the objects with the goal to implement my own cloning function and it was... long.

### As for today

This is it. I'll probably write a second article to follow up on the end of the project. Once the cloning has been made, it should be quite easy to reproduce at least simple shapes/text. Sending them over the network is a piece of cake, so I'm not worried for the future.

PatchPanel is quite interesting and offers a lot of possibilities, but I honestly think Adobe did not really put a lot of thoughts into it, and rather made "the fastest AS<->JS bridge" possible rather than a full rewrite which would have enabled more power to us, consumers. As it's a very early beta, let's hope for the future.

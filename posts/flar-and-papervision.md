---
title: FLAR + PV3D = ?
description: Fixes and trials of the combination of Papervsion and FLAR for AR experiences in Flash
timestamp: 1239202800000
---
<disclaimer>The original article has been retrieved from the internet archive machine and edited for fluidity.</disclaimer>

I'm currently working with FLAR (Flash Augmented Reality). It's playful but soooo bugged. It's kinda killing the joy.

1/ There's no getter for position and rotation of the marker in the 3D space. Hopefully some dude made a snippet for that. Still it's a shame it comes from "a random guy on the internet:

```
private var transformation:FLARTransMatResult = new FLARTransMatResult();

public function get position():Array
{
  try
  {
    detector.getTransformMatrix(transformation);

    var tmp:Matrix3D = new Matrix3D();
      tmp.n11 =  transformation.m01; tmp.n12 =  transformation.m00; tmp.n13 =  transformation.m02; tmp.n14 =  transformation.m03;
      tmp.n21 = -transformation.m11; tmp.n22 = -transformation.m10; tmp.n23 = -transformation.m12; tmp.n24 = -transformation.m13;
      tmp.n31 =  transformation.m21; tmp.n32 =  transformation.m20; tmp.n33 =  transformation.m22; tmp.n34 =  transformation.m23;

      return [new Number3D(tmp.n14, tmp.n24, tmp.n34), Matrix3D.matrix2euler(tmp)]
  }
  catch(e:Error) {}

  return null;
}
```

2/ Axis are not normalized along with Papervision. Z is mixed with Y, and so X is reversed. It's unmanageable when in comes to using the 3d engine (moveForward is moveBackward, pitch, roll, etc...)

3/ The only documentation is in Japanese. God I wish I could speak.

This makes every authoring task in the 3d environment painful, and I'm not talking about linking with a 3d physics engine which could also bring its own challenges.

Even though, it's still very CPU costly. My iMac "latest" needs full power to process a 320x260@30fps camera frame to have some kind of performances.

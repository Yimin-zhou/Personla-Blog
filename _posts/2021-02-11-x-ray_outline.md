---
date: 2021-02-11 23:48:05
layout: post
title: Outline with Stencil Test
description: >-
  Outline with Stencil Test in Unity
image: https://s6.jpg.cm/2022/08/03/PQ2C5C.gif
tags: [project]
---

## Ideas.
- The stencil value (Stencil Value) in the stencil buffer is usually 8 bits, so there are 256 different stencil values per fragment/pixel. The values in the stencil buffer are used during stencil testing to decide whether to discard or keep the slice elements in subsequent plots.
- 1. turn on stencil buffer writing. 2. render the object and update the stencil buffer. 3. turn off stencil buffer writing. 4. render (other) objects, this time discarding specific fragments based on the stencil buffer contents.
The outline is implemented by drawing two objects, the second with a slightly larger scale, and using a template test to remove the overlap with the original object to get the outline effect.
Template tests add.
![](/assets/img/stencil_outline/1.png)

- 2: Set the reference value. In addition to 2, any number from 0-255 can be set.
Comp equal: indicates the condition to pass the template test. Here only pixels equal to 2 are considered to pass the test. In addition to equal, there are Greater, Less, Always, Never, etc., similar to ZTest.
Pass keep: indicates the pixel that passes the template test and the Z test (note that both pass), how to dispose of its template value, here we keep its template value. In addition to keep, there are Replace, IncrWrap (loop self-incrementing 1, more than 255 for 0), IncrSat (self-incrementing 1, more than 255 or 255), DecrWrap, DecrSat, etc.
Fail decrWrap: indicates the pixel that does not pass the template test, what to do with its template value.self-decrease.
ZFail keep: the pixel which passed the template test but not the Z test, what to do with its template value.

## Process. 
### 1. Set the first pass that renders the actual object.
![](/assets/img/stencil_outline/2.png)
comp set to always means always pass.
If pass is replace, then pixels that pass both stencil and depth will replace the value in the stencil buffer with their reference stencil value.
zfail is also replace, so that even if the object is occluded, base needs to block the outline.

### 2. The first pass would just set a simple color output of. 
![](/assets/img/stencil_outline/3.png)

### 3. outline Pass. 
![](/assets/img/stencil_outline/4.png)
Set the stencil comp of the stencil pass to notequal, so that it will not show up when overwritten with the body.
Add the outline for the vertices, and you have a outlined effect: ````.

```
output.positionCS = TransformObjectToHClip(float4(input.positionOS + input.normalOS * _OutlineWidth * 0.1 ,1));
```

Two identical objects will not have inner outline.
![](/assets/img/stencil_outline/5.png)

### 4. Perspective. 
The default template value is 0. Theoretically this outline will be displayed again at the top of all objects.
But because the rendering order will be obscured by some opaque objects. So add a tag for the rendering queue of transparent objects: !
![](/assets/img/stencil_outline/6.png)

### 5. Result:
 This gives a simple effect:
![](/assets/img/stencil_outline/7.gif)

---
---
date: 2021-04-10 23:48:05
layout: post
title: pre integrated skin SSS effect
description: >-
  Pre integrated skin SSS effect in Unity
image: https://s6.jpg.cm/2022/08/03/PQ2oL8.gif
tags: [project]
---

## Principle.
-Skin is multi-layered structure, with its surface oil layer contributing primarily to the reflected portion of skin light (about 6% of the incident light), while the epidermis and dermis below the oil layer contribute primarily to the sub-surface scattered portion (about 94% of the incident light). Any light that is not reflected directly off the skin surface goes directly to the subsurface layer. This subsurface scattering property, which is the dominant factor, determines the translucent character of the skin and its soft visual appearance.
The incident light interacts with the skin, is partially absorbed (acquires color) and is scattered several times, returning and leaving the surface at the 3D neighborhood around the entry point. And sometimes the light passes completely through a thin area like the ear, creating transmission.
![](/assets/img/pre-sss-skin/1.png)
Pre-Integrated Skin Shading is actually a solution implemented by backpropagation from the results. The specific idea is to precompute the effect of subsurface scattering into a two-dimensional lookup table with parameters dot(N,L) and curvature, since the combination of these two would be able to reflect the change of light with curvature.
![](/assets/img/pre-sss-skin/2.png)

## Production. 
### 1. 
First add the previous PBS-related code (BRDF).
![](/assets/img/pre-sss-skin/3.png)
### 2. 
Precalculus correlation. 
Find with dot(N,L) and curvature (spherical radius) for LUT.
First calculate the curvature, which is calculated as follows.
![](/assets/img/pre-sss-skin/0.png)
The fwidth() function represents.
fwidth(v) = abs( ddx(v) + ddy(v))
ddx(v) = the value of v to the right of this pixel - the value of v for this pixel
ddy(v) = the value of v below this pixel - the value of v at this pixel
ddx,ddy extensions.
Contemporary GPGPUs are generally pixelated with 2x2 pixels as the basic unit, so in this 2x2 pixel block, the x coordinate of the fragment corresponding to the pixel on the right minus the x coordinate of the fragment corresponding to the pixel on the left is ddx; the y coordinate of the fragment corresponding to the pixel on the bottom minus the y coordinate of the fragment corresponding to the pixel on the top is ddy. y is ddy.
ddx and ddy represent the distance between two adjacent pixels in the device coordinate system, according to which you can determine which layer of the mapping LOD should be used (if the mapping supports LOD, that is, MIPS). A larger distance means that the triangle is farther away from the camera and needs a smaller resolution map; conversely, it is closer to the camera and needs a higher resolution map.
Code.


```
//curvature
float deltaWorldNormal = length(fwidth(N));
float deltaWorldPos = length(fwidth(lightingData.positionWS));
float curvature = (deltaWorldNormal / deltaWorldPos);
```

Semi-Lambert.
```
float halfLambert = 0.5 + 0.5 * dot(N,L);
```

Sampling controls the curvature by multiplying the curvature by a parameter.
```
float3 sss = tex2D(_SSSLUT, float2(halfLambert, curvature * 1/_sssControl));
```
LUT:
![](/assets/img/pre-sss-skin/4.png)
Effect.
![](/assets/img/pre-sss-skin/5.png)
![](/assets/img/pre-sss-skin/6.gif)

---
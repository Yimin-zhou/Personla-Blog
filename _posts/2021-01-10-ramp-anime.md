---
date: 2021-01-10 23:48:05
layout: post
title: Anime Shader
subtitle: 一个简单的二次元效果
description: >-
  Anime Shader in Unity
image: assets\img\cover\anime.gif
tags: [project]
---

## Process

### 1. Older anime effects (previously implemented, non-ramp).

![](/assets/img/4-3-ramp-anime/1.png)

### 2. Target effects.

-three layers of Ramp coloring
-clothing combined with PBR coloring
-Hair anisotropic highlights
-Shadow shading range with vertex color control
-Stroke smoothing

### 3. ramp coloring.

- Triple Ramp: Roughly three ramps to control skin coloring.
![](/assets/img/4-3-ramp-anime/2.png)
- As shown above, three channels are used to store three masks, and for each layer the coloring is as follows, with a semi-Lambert value and a control amount to control the sampling of the ramp mapping. And use the single channel after sampling to interpolate the shadows and bright parts to achieve a smooth transition.

``` bash
float4 rampControl1 = tex2D(_RampTexture, float2(saturate(halfLambert - (1-_ShadowRange1)), 0.5)).r;
float3 shadeLayer1 = lerp(_ShadowColor,surfaceData.albedo.rgb * _RampColor1 * _RampIntensity, rampControl1);
```

- Single-layer R-channel effect.
![](/assets/img/4-3-ramp-anime/3.png)

- Single-layer G-channel effect:
![](/assets/img/4-3-ramp-anime/4.png)

- Single-layer B-channel effect:
![](/assets/img/4-3-ramp-anime/5.png)

- The effect of adding the three channels together:
![](/assets/img/4-3-ramp-anime/6.png)

``` bash
float3 celResult = (shadeLayer1 + shadeLayer2 + shadeLayer3) * mainLight.color.rgb * _LightAffector;
```

- Multiply by a control parameter at the end of the stack to facilitate control of the overall brightness.

### 4. Edge light.

- Use the view direction to determine the edge light.

``` bash
half rim = smoothstep(_RimLightMin, _RimLightMax, 1-ndv);
rim = smoothstep(0, _RimLightSmooth, rim);
```

- The principle is similar to Fresnel, the brighter at the edges. And use smoothstep to smooth the transition of the edge light.

### 5. Effect.

![](/assets/img/4-3-ramp-anime/7.png)


---
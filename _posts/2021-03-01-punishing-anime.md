---
date: 2021-02-01 23:48:05
layout: post
title: Anime Effect
description: >-
  Anime Effect in Unity
image: https://s6.jpg.cm/2022/08/03/PQ2Bok.gif
tags: [project]
---

## Process

### 1. Target effect.

-Sample ramp to get the cartoon lighting effect.
-Face, hair fixed area highlights.
-Clothing combined with PBR lighting.
-Edge light calculated with depth.
-Frontal hair projection.
-Hair and eye blending.
-Vertex flare stroke with vertex brush tool.


### 2. Material analysis.

There are two types of AO (composite mapping) mapping.

- The first type.
![](/assets/img/punishing_anime/1.png)

AO mapping of the face and hair.
![](/assets/img/punishing_anime/2.png)

The R channel is the mask for the highlights, fixed with only a triangular highlight near the nose.
The G channel is the mask for shadows, always shaded below the neck (the secondary is like this).

-second.
![](/assets/img/punishing_anime/3.png)

AO mapping of the costume. (ilm mapping)
![](/assets/img/punishing_anime/4.png)

The G channel also shows a fixed shadow area (shadow weights).
R should also be the highlight area, and B is the brightness of the highlight in the shadow area.
A is the self-illumination.

PBR mapping
![](/assets/img/punishing_anime/5.png)

Used on dress pants, which receive PBR lighting.
![](/assets/img/punishing_anime/6.png)

The R channel is metallic.
G channel is roughness.
B channel is AO (true AO in pbr), the range is very small, the secondary is to be clean.
A channel is whether to use the PBR mask

### 3. Production.
1. edge light.
-first make a simple edge light effect (ndv), look at the effect
```
half rim = smoothstep(_RimLightMin, _RimLightMax, 1-ndv);
rim = smoothstep(0, _RimLightSmooth, rim);
half3 rimColor = rim * _RimLightColor.rgb * _RimLightIntensity;
```

2. face, body lighting.
![](/assets/img/punishing_anime/7.png)

-Face and body lighting is sampled using semi-Lambert lighting for ramp mapping (different ramps for face and body).
```
float halfLambert = ndl * _ShadowRangeAffector * 0.5 + 0.5;
halfLambert = lerp(0.5,halfLambert, surfaceData.shadowMask * _ShadowMaskAffector);
float4 rampControl = tex2D(_RampTexture, float2(saturate(halfLambert - _ShadowRange), 0.5)).r;
float3 shadeLayer = lerp(_ShadowColor, surfaceData.albedo.rgb * _RampColor * _RampIntensity, rampControl);
```

Note: Here the sampled ramp is the sampled x-axis, mapping halfLambert 0-1.
```
-halfLambert used to sample ramp before also subject to the previously mentioned ilm mapping in the specified shadow range of the mapping (as a way to achieve the effect of the neck has been in the shadow).
float3 celResult = shadeLayer * mainLight.color.rgb * _LightAffector;
```

-Finally multiply the light color and a control amount and output.
-(The face has almost no edge light)

3. Face and hair highlights.

-There are always some fixed parts in the Warframe game that have highlights, such as the face and hair:.
![](/assets/img/punishing_anime/8.png)

-With blinnphong highlight calculation.
```
float3 specularResult = mainLight.color.rgb * _SpecularColor.rgb * pow(ndh, _SpecularPower);
return specularResult * surfaceData.highLightMask;
```

-The final return is just multiplying the highLightMask directly.
-The current effect.
![](/assets/img/punishing_anime/9.png)

(The clothes did not use ramp, used smoothstep, the same is used to adjust Lambert).

4. Self-illumination
-ilm map's self-illumination is in the a channel.
```
[HDR] _EmissionColor ("Emission color", Color) = (1,1,1,1)
```
-Assert an HDR color, multiply this color by the final self-luminous mask and add other results

4. PBR lighting for clothing
-First apply the normal mapping in the usual way.
-PBR mapping r channel is metallicity, g is roughness, b is ao.
-Apply the previously done PBR effect code.
```
float3 pbrLight = PBR(surfaceData,mainLight,N,L,V,H,ndl,ndv,hdv,ndh);
```
-lerp for cartoon lighting and PBR lighting using PBR's mask:
```
float3 finalResult = lerp(toonResult,pbrLight,surfaceData.mask);
```
-This makes a good distinction between cartoon light and PBR light.
```
-#pragma shader_feature ENABLE_PBR
```
-Add another switch for easy testing.
-PBR lighting for this model, mainly for the pants and camera parts.

![](/assets/img/punishing_anime/10.png)
![](/assets/img/punishing_anime/11.png)

5. Current effect.
![](/assets/img/punishing_anime/12.png)
![](/assets/img/punishing_anime/13.png)

Another effect of the model: PBR more
![](/assets/img/punishing_anime/14.png)



---
---
date: 2021-02-01 23:48:05
layout: post
title: 战双效果尝试
subtitle: 根据素材尝试还原战双卡通效果
description: >-
  在Unity根据素材尝试还原战双卡通效果
image: https://s6.jpg.cm/2022/08/03/PQ2Bok.gif
category: 效果
tags: [project]
---

参考ShaderToy上的shader在Unity中实现雨滴效果

## 过程

### 1.目标效果：

-采样ramp得到的卡通光照效果。
-脸部，头发固定区域高光。
-服装结合PBR光照。
-用深度来计算的边缘光。
-额发投影。
-头发和眼睛融合。
-顶点外扩描边配合顶点刷工具。


### 2.素材分析：

有两种AO（复合贴图）贴图：
- 第一种：
![](/assets/img/punishing_anime/1.png)
脸部和头发的AO贴图。
![](/assets/img/punishing_anime/2.png)
R通道是高光的mask，固定只在鼻子附近有一个三角高光。
G通道是阴影的mask，脖子下方总是阴影（二次元是这样的）。

-第二种：
![](/assets/img/punishing_anime/3.png)
服装的AO贴图。（ilm贴图）
![](/assets/img/punishing_anime/4.png)
G通道也是显示了固定的阴影区域（阴影权重）。
R应该也是高光区域，B是高光在阴影区域的亮度。
A 是自发光。
PBR贴图
![](/assets/img/punishing_anime/5.png)
用在衣服裤子上，衣服裤子接受PBR光照。
![](/assets/img/punishing_anime/6.png)
R通道是metallic.
G通道是roughness.
B通道是AO（pbr中真正的AO），范围很小，二次元就是要干净些。
A通道是是否使用PBR的mask

### 3.制作：
1. 边缘光：
-先制作一个简单的边缘光效果（ndv）,看看效果
```
half rim = smoothstep(_RimLightMin, _RimLightMax, 1-ndv);
rim = smoothstep(0, _RimLightSmooth, rim);
half3 rimColor = rim * _RimLightColor.rgb *  _RimLightIntensity;
```

2. 脸部，身体光照：
![](/assets/img/punishing_anime/7.png)
-脸部和身体的光照是利用半兰伯特光照对于ramp贴图进行采样（脸和身体用的ramp不一样）：
```
float halfLambert = ndl * _ShadowRangeAffector * 0.5 + 0.5;
halfLambert = lerp(0.5,halfLambert, surfaceData.shadowMask * _ShadowMaskAffector);
float4 rampControl =  tex2D(_RampTexture, float2(saturate(halfLambert - _ShadowRange), 0.5)).r;
float3 shadeLayer = lerp(_ShadowColor,surfaceData.albedo.rgb * _RampColor * _RampIntensity, rampControl);
```

注：这里采样ramp是采样的X轴，映射halfLambert 0-1。
```
-halfLambert用来采样ramp之前还要受之前提到的ilm贴图中规定阴影范围的贴图影响（以此达到脖子一直处于阴影的效果）。
float3 celResult = shadeLayer * mainLight.color.rgb * _LightAffector;
```

-最后乘上光照颜色和一个控制量然后输出。
-（脸部几乎没有边缘光）

3.脸部和头发的高光：
-在战双游戏中始终有些固定部位有高光，如脸部和头发：
![](/assets/img/punishing_anime/8.png)
-用blinnphong高光计算：
```
float3 specularResult = mainLight.color.rgb * _SpecularColor.rgb * pow(ndh, _SpecularPower);
return  specularResult * surfaceData.highLightMask;
```

-最后返回的时候直接乘上高光mask就可以了。
-目前效果：
![](/assets/img/punishing_anime/9.png)
（衣服没用ramp，用的smoothstep, 同样是用兰伯特来进行调整）。

4.自发光
-ilm map的自发光是在a通道。
```
[HDR] _EmissionColor ("Emission color", Color) = (1,1,1,1)
```
-申明一个HDR颜色，在最后自发光的mask乘上这个颜色再加上其他结果即可

4.服装的PBR光照
-先用常规的方式应用好法线贴图。
-PBR 贴图中r通道是金属度，g是粗糙度，b是ao。
-套用之前做的PBR效果代码：
```
float3 pbrLight = PBR(surfaceData,mainLight,N,L,V,H,ndl,ndv,hdv,ndh);
```
-利用PBR的mask对卡通光照和PBR光照进行lerp:
```
float3 finalResult = lerp(toonResult,pbrLight,surfaceData.mask);
```
-这样就能很好的进行卡通光和PBR光区分。
```
-#pragma shader_feature ENABLE_PBR
```
-再加一个开关，方便测试。
-这个模型主要是裤子和相机部分用的PBR光照：
![](/assets/img/punishing_anime/10.png)
![](/assets/img/punishing_anime/11.png)

5.目前效果：
![](/assets/img/punishing_anime/12.png)
![](/assets/img/punishing_anime/13.png)

另外一个模型的效果：PBR更多
![](/assets/img/punishing_anime/14.png)



---
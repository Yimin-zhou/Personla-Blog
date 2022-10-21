---
date: 2021-01-10 23:48:05
layout: post
title: 三层ramp二次元Shader
subtitle: 一个简单的二次元效果
description: >-
  unity实现一个简单的二次元效果
image: https://s6.jpg.cm/2022/08/03/PQ2v0w.gif
category: 效果
tags:
  - shader
  - unity
---

## 过程

### 1.旧版二次元效果（以前实现的，非ramp）：

![](/assets/img/4-3-ramp-anime/1.png)

### 2.目标效果：

-三层Ramp着色
-衣服结合PBR着色
-头发各向异性高光
-可用顶点色控制阴影着色范围
-描边平滑

### 3.ramp着色：

- 三层Ramp: 大致就是三张ramp来控制皮肤的染色
![](/assets/img/4-3-ramp-anime/2.png)
- 如上图所示，用三个通道存三张mask, 对于每一层的着色都如下，用半兰伯特的值和一个控制量对控制ramp贴图的采样。并用采样之后的单个通道对阴影和亮部进行插值，达到平滑过渡。

``` bash
float4 rampControl1 =  tex2D(_RampTexture, float2(saturate(halfLambert - (1-_ShadowRange1)), 0.5)).r;
float3 shadeLayer1 = lerp(_ShadowColor,surfaceData.albedo.rgb * _RampColor1 * _RampIntensity, rampControl1);
```

- 单层R通道效果：
![](/assets/img/4-3-ramp-anime/3.png)

- 单层G通道效果：
![](/assets/img/4-3-ramp-anime/4.png)

- 单层B通道效果：
![](/assets/img/4-3-ramp-anime/5.png)

- 将三个通道加起来的效果：
![](/assets/img/4-3-ramp-anime/6.png)

``` bash
float3 celResult = (shadeLayer1 + shadeLayer2 + shadeLayer3) * mainLight.color.rgb * _LightAffector;
```

- 在最后叠加的时候乘上一个控制参数，方便控制整体亮度。

### 4.边缘光：

- 用视角方向来决定边缘光：

``` bash
half rim = smoothstep(_RimLightMin, _RimLightMax, 1-ndv);
rim = smoothstep(0, _RimLightSmooth, rim);
```

- 原理类似菲涅尔，边缘处越亮。并用smoothstep对边缘光的过渡进行平滑处理。

### 5.效果：

把之前的效果进行叠加：（图中有一个简单的描边效果）
![](/assets/img/4-3-ramp-anime/7.png)


参考:
米哈游Unity分享;
网易黑潮之上的做法；

---
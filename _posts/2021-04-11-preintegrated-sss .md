---
date: 2021-04-10 23:48:05
layout: post
title: 伪预积分的皮肤SSS效果
subtitle: 皮肤次表面散射
description: >-
  在Unity实现的伪预积分的皮肤SSS效果
image: /assets/img/cover/sss.gif
category: 效果
tags:
  - shader
  - unity
  - archive

---

## 原理：
-皮肤是一个多层结构，其表面油脂层主要贡献了皮肤光照的反射部分（约占入射光中的6%），而油脂层下面的表皮层和真皮层则主要贡献了次表面散射部分（约占入射光中的94%）。任何没有直接从皮肤表面反射出去的光，都会直接进入次表面层。这种占主要主导因素的次表面散射属性，决定了皮肤半透明的特征以及柔软的视觉外观。
入射光与皮肤进行交互的过程中，被部分吸收（获取颜色）并经过多次散射，返回并从进入点周围的3D邻域处表面离开。而有时光线会完全穿过像耳朵这样的薄薄区域，形成透射。
![](/assets/img/pre-sss-skin/1.png)
-预积分的皮肤着色（Pre-Integrated Skin Shading），其实是一个从结果反推实现的方案，具体思路是把次表面散射的效果预计算成一张二维查找表，查找表的参数分别是dot(N,L)和曲率，因为这两者结合就能够反映出光照随着曲率的变化。
![](/assets/img/pre-sss-skin/2.png)

## 制作： 
### 1. 
先加入之前的PBS相关代码（BRDF），效果：
![](/assets/img/pre-sss-skin/3.png)
### 2. ： 
预积分相关。 
用dot(N,L)和曲率(球面半径)对于LUT进行查找：
先计算曲率，曲率计算方式如图：
![](/assets/img/pre-sss-skin/0.png)
fwidth()函数表示：
fwidth（v） = abs( ddx(v) + ddy(v))
ddx(v) = 该像素点右边的v值 - 该像素点的v值
ddy(v) = 该像素点下面的v值 - 该像素点的v值
ddx,ddy延伸：
当代GPGPU在像素化的时候一般是以2x2像素为基本单位，那么在这个2x2像素块当中，右侧的像素对应的fragment的x坐标减去左侧的像素对应的fragment的x坐标就是ddx；下侧像素对应的fragment的坐标y减去上侧像素对应的fragment的坐标y就是ddy。
ddx和ddy代表了相邻两个像素在设备坐标系当中的距离，据此可以判断应该使用哪一层的贴图LOD（如果贴图支持LOD，也就是MIPS）。这个距离越大表示三角形离开摄像机越远，需要使用更小分辨率的贴图；反之表示离开摄像机近，需要使用更高分辨率的贴图。
代码：


```
//curvature
float deltaWorldNormal = length(fwidth(N));
float deltaWorldPos = length(fwidth(lightingData.positionWS));
float curvature = (deltaWorldNormal / deltaWorldPos);
```

半兰伯特：
```
float halfLambert = 0.5 + 0.5 * dot(N,L);
```

采样时对曲率乘上一个参数来控制曲率：
```
float3 sss = tex2D(_SSSLUT, float2(halfLambert, curvature * 1/_sssControl));
```
LUT:
![](/assets/img/pre-sss-skin/4.png)
效果：
![](/assets/img/pre-sss-skin/5.png)
![](/assets/img/pre-sss-skin/6.gif)

---
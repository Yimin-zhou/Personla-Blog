---
date: 2020-12-15 23:48:05
layout: post
title: UE置换Shader
subtitle: 置换效果的简单尝试
description: >-
  虚幻4中对于置换效果的尝试
image: /assets/img/cover/dis.gif
category: 效果
tags:
  - shader
  - ue
  - archive

---

## 过程

### 大致思路：

在材质编辑器中使用 VertexNormalWS 获得世界空间中的顶点法线坐标
顶点法线接入world displacement 之前与一个Displacement值相乘（以便控制）
再与一个Displacement map相乘（黑色区域为0，不错位；白色区域为1，错位

### 1：

获得顶点法线坐标（位移方向），与Displacement相乘（位移大小）

![](/assets/img/2-UE-DISPLACEMENT/1.png)

### 2：

与 Displacement map 相乘， 获得想要错位的区域

![](/assets/img/2-UE-DISPLACEMENT/2.png)


### 3：

大致效果。

![](/assets/img/2-UE-DISPLACEMENT/3.png)


## 制作水坑：

## 思路：

根据像素的模型空间高度（z轴方向）以及一个阀值判断是否应为水坑
Normal map 不应用到水坑中（平的）

### 1：

获得z轴的世界坐标，并减去一个WaterLevel值，以此来控制水面高低，再减去一个模型的世界坐标（以此以模型坐标原点为水面高低原点）

![](/assets/img/2-UE-DISPLACEMENT/4.png)
![](/assets/img/2-UE-DISPLACEMENT/5.png)

### 2：

将上一步的结果除以一个FallOff值，获得一个比较平滑的过渡（要在clamp之前进行，如原本值为1，1/10 = 0.1，就能得到0-1之间的过渡值）。用Clamp保证值不会超过0-1。用clamp后的结果对水的颜色和贴图颜色做Lerp
（结果为0（低于WaterLevel）显示为水颜色，结果为1显示贴图颜色）

![](/assets/img/2-UE-DISPLACEMENT/6.png)
![](/assets/img/2-UE-DISPLACEMENT/7.png)

### 3：

同样使用Clamp后的值对Normal map和原本平面法线进行lerp（使水面扁平）。
还是用Clamp后的值，水面roughness与roughness map lerp, 水面roughness值低。

![](/assets/img/2-UE-DISPLACEMENT/8.png)
![](/assets/img/2-UE-DISPLACEMENT/9.png)
![](/assets/img/2-UE-DISPLACEMENT/10.png)

### 4:

将世界空间的位置采样为UV：
不同物体用同一材质可无缝对接。
获得每个像素的世界位置，只取xy, 用一个Divide normalize, 乘上Tilling 作为UV 连接到 texture sampler节点（UVs 没有连接节点的话默认连接一
texcoord节点）

![](/assets/img/2-UE-DISPLACEMENT/11.png)
![](/assets/img/2-UE-DISPLACEMENT/12.png)

### 4:

控制细面曲分：
根据摄像机位置减少增加细面曲分。
-获得actor位置，计算与摄像机的位置（normalize）,要近大远小所用用1-x, 乘上tessellation 参数接入主节点 上tessellation multiplier。
![](/assets/img/2-UE-DISPLACEMENT/13.png)
![](/assets/img/2-UE-DISPLACEMENT/14.png)
![](/assets/img/2-UE-DISPLACEMENT/15.png)

---
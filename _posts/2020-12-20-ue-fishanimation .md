---
date: 2020-12-15 23:48:05
layout: post
title: UE鱼的动画Shader
subtitle: 利用顶点位移来实现动画
description: >-
  虚幻4中利用顶点位移来实现动画
image: /assets/img/cover/fish.gif
category: 效果
tags:
  - shader
  - ue
  - archive

---

## 过程

## 大致思路：

整个模型的左右位移
模型各个像素的offset
用sine()

### 1.先用模型world position 做一个offset：

![](/assets/img/3-Unreal-animated-fish/1.png)
![](/assets/img/3-Unreal-animated-fish/2.png)
![](/assets/img/3-Unreal-animated-fish/3.png)


### 2.以Z为轴旋转：

用上一步的sine函数让鱼左右摇摆：

![](/assets/img/3-Unreal-animated-fish/4.png)
![](/assets/img/3-Unreal-animated-fish/5.png)

### 3：

y轴方向的sine函数offset（每个像素的世界坐标位置）（add中加上之前第一步的sine）。
除以一个参数，降低频率。

![](/assets/img/3-Unreal-animated-fish/6.png)
![](/assets/img/3-Unreal-animated-fish/7.png)

### 4：

z轴方向的sine函数offset（每个像素的世界坐标位置）。

![](/assets/img/3-Unreal-animated-fish/8.png)
![](/assets/img/3-Unreal-animated-fish/9.png)

### 5：

前几步加起来接入主节点的worldpostion offset。

![](/assets/img/3-Unreal-animated-fish/10.png)

### 6：

用一个mask使头部运动更少（在uv2中）。

![](/assets/img/3-Unreal-animated-fish/11.png)
![](/assets/img/3-Unreal-animated-fish/12.png)

### 7：

调调参数，结果：

![](/assets/img/3-Unreal-animated-fish/13.png)

TODO:
GDC TALK……..
https://www.youtube.com/watch?v=l9NX06mvp2E

---
---
date: 2020-12-15 23:48:05
layout: post
title: Finish Animation Shader
description: >-
  Animation using vertex displacement
image: https://s6.jpg.cm/2022/08/03/PQ20Fr.gif
tags: [project]
---

## Process

## Ideas

The left and right shift of the whole model.
Offset of each pixel of the model with `sine()`.

### 1.First make an offset with the model world position：

![](/assets/img/3-Unreal-animated-fish/1.png)
![](/assets/img/3-Unreal-animated-fish/2.png)
![](/assets/img/3-Unreal-animated-fish/3.png)


### 2.Rotation in Z-axis.：

Use the sine function from the previous step to make the fish sway from side to side:

![](/assets/img/3-Unreal-animated-fish/4.png)
![](/assets/img/3-Unreal-animated-fish/5.png)

### 3：

The sine function offset (the world coordinate position of each pixel) in the y-axis direction (add the sine from the previous step in add).
Divide by one parameter to reduce the frequency.

![](/assets/img/3-Unreal-animated-fish/6.png)
![](/assets/img/3-Unreal-animated-fish/7.png)

### 4：

The sine function offset in the z-axis direction (the world coordinate position of each pixel).

![](/assets/img/3-Unreal-animated-fish/8.png)
![](/assets/img/3-Unreal-animated-fish/9.png)

### 5：
The first few steps add up to the worldpostion offset of the access master node.

![](/assets/img/3-Unreal-animated-fish/10.png)

### 6：

Use a mask to make the head move less (in uv2).

![](/assets/img/3-Unreal-animated-fish/11.png)
![](/assets/img/3-Unreal-animated-fish/12.png)

### 7：

Tune the parameters, and the result.

![](/assets/img/3-Unreal-animated-fish/13.png)

TODO:
GDC TALK……..
https://www.youtube.com/watch?v=l9NX06mvp2E

---
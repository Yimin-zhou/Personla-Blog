---
date: 2021-02-11 23:48:05
layout: post
title: 通过模板测试的透视描边
subtitle: 透视描边效果
description: >-
  在Unity中用模板测试实现的简单描边效果
image: https://s6.jpg.cm/2022/08/03/PQ2C5C.gif
category: 效果
tags:
  - shader
  - unity
---

## 原理：
模板缓冲中的模板值(Stencil Value)通常是8位的，因此每个片段/像素共有256种不同的模板值。模板测试时利用模板缓冲中的值来决定是丢弃还是保留后续绘图中的片元。
1.开启模板缓冲写入。2.渲染物体，更新模板缓冲。3.关闭模板缓冲写入。4.渲染（其他）物体，这次基于模板缓冲内容丢弃特定片段。
描边实现是通过绘制两个物体，第二个物体的scale稍微大一些，并且用模板测试来去除与原物体重叠的部位，以此来得到描边效果。
模板测试补充：
![](/assets/img/stencil_outline/1.png)
Ref 2：设置参考值。除了2，还可以设置0-255的任意数。
Comp equal：表示通过模板测试的条件。这里只有等于2的像素才算通过测试。除了equal，还有Greater、Less、Always、Never等，类似ZTest。
Pass keep：表示通过模板测试和Z测试（注意是都通过）的像素，怎么处置它的模板值，这里我们保留它的模板值。除了keep，还有Replace，IncrWrap（循环自增1，超过255为0），IncrSat（自增1，超过255还是255），DecrWrap，DecrSat等。
Fail decrWrap：表示没通过模板测试的像素, 怎么处置它的模板值。这里为循环自减。
ZFail keep：表示通过了模板测试但没通过Z测试的像素，怎么处置它的模板值。这里为保持不变。

## 制作： 
### 1. 设置第一个渲染实际物体的pass：
![](/assets/img/stencil_outline/2.png)
comp设置为always代表永远通过。
pass 为 replace的话，那都模板和深度都通过的像素，会用其参考模板值替换模板buffer中的值。
zfail也为replace，这样的话就算物体被遮挡，base也需要挡住描边。

### 2.第一个pass就只设置一个简单的颜色输出： 
![](/assets/img/stencil_outline/3.png)

### 3.描边Pass： 
![](/assets/img/stencil_outline/4.png)
讲描边pass的stencil comp设置为 notequal,这样在和本体覆盖的时候不会显示出来。
再加上对于顶点的外扩，就可以做出一个描边的效果啦：

```
output.positionCS = TransformObjectToHClip(float4(input.positionOS + input.normalOS * _OutlineWidth * 0.1 ,1));
```

两个相同物体不会出现内描边的情况。
![](/assets/img/stencil_outline/5.png)

### 4.透视： 
默认的模板值是0，理论上这个描边会显示再所有物体最前面，
但因为渲染顺序会被一些不透明物体遮挡。所以加上一个tag，进行透明物体的渲染队列：
![](/assets/img/stencil_outline/6.png)

### 5.结果:
 这样就有一个简单的透视描边效果啦：
![](/assets/img/stencil_outline/7.gif)

### 参考:
1.描边效果：https://zhuanlan.zhihu.com/p/67466642
2.模板缓存：https://zhuanlan.zhihu.com/p/28506264
---
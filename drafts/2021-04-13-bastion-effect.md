---
date: 2021-04-13 23:48:05
layout: post
title: 物体组装特效
subtitle: 物体从消失到出现的特效
description: >-
  在Unreal实现的物体组装特效
image: /assets/img/cover/iron.gif
category: 渲染
hidden: true

---
# 目标效果：
展示物体细节部件出现组装效果（类似从scale 0 到 scale 1）。
展示物体线框效果。
界面展示UI。

# 制作过程：
## 物体出现效果。
第一步：先用一堆cube来进行效果的实现和测试。
![](/assets/img/bastion/1.png)
通过Unreal的材质编辑器中的World postion offset，做一个简单的Vertex shader:
![](/assets/img/bastion/2.png)
大致原理就是对顶点进行由中心到边缘或者由边缘到中心的偏移，现在先暂时手动用一个参数进行控制。
![](/assets/img/bastion/3.png)
![](/assets/img/bastion/4.png)
再加一个类似游戏Bastion中的效果，效果从缩放出现改变成位移出现。
![](/assets/img/bastion/5.png)
也是在Vertex shader中进行的实现，物体当前位置乘上一个float3来控制方向（默认z轴），再用一个参数来暂时手动控制位移。
![](/assets/img/bastion/6.png)
![](/assets/img/bastion/7.png)
将这两个效果加起来，连入World postion offset，之后在蓝图中可以分别控制这两个参数来实现整体效果。

注：Scale_ 参数默认为0(0-1)，Position_ 参数默认为 3(0-3)， 为初始状态，方便改变参数时展现效果动画。

## 线框特效。
先是获得每个像素的世界空间坐标值（获得“分区”），减去object position。然后与一个参数进行Fmod来得到更多的坐标“分界线”。
![](/assets/img/bastion/8.png)（Fmod前效果）![](/assets/img/bastion/9.png)（Fmod后）
用一个参数来减之后就会只剩下“分界线”，再与1进行点乘来的到一个网格的“mask” 
![](/assets/img/bastion/10.png)
![](/assets/img/bastion/11.png)
和自发光相乘的大致效果：
![](/assets/img/bastion/12.png)
但上面这个线框效果效果并不好，物体移动时线框也会移动。

还是做一个根据模型自身的线框来的效果：
在材质中直接勾选Wireframe 就可以得到一个线框的效果：
![](/assets/img/bastion/13.png)
但这样看起来比较乱，而且没有其他（如光照等效果了。
于是再加一个模型（两个材质，主要区别就是一个开启wireframe，一个不开启）。和线框叠在一起，就是一个还算可以的线框网格效果。
![](/assets/img/bastion/14.png)

## 效果的应用。
大致思路是用蓝图来对之前的两个参数 Scale_ 和 Position_ 进行控制，如使用Time line。
第一步：将两个材质共用的Scale和Position参数放入Material parameter collection。
![](/assets/img/bastion/15.png)
同时再对材质进行修改。

创建一个蓝图，对Scale和Position进行控制。
![](/assets/img/bastion/16.png)
创建一个Time line:
利用时间对于这两个参数进行修改，以此来达到一个动画的效果。
![](/assets/img/bastion/17.png)

第二步：对于用来展示的模型进行修改。
目前的模型是一个整体，无法做到各种细小部件组合的效果，于是在Maya当中用提取面来选择出不同的部件（面选择双击会自动选出相连接的部件面）：
![](/assets/img/bastion/18.png)
这样再加上之前的效果，就可以有一个不错的整体效果。




## 展示UI。
第一步：大致UI效果。
界面主要分为两部分，主菜单和展示界面，
先制作主菜单，大致是一个在转动的圆环，中间有一个开始按钮，按一下就可以加载展示车辆的关卡，并配上一些动画（UI素材来自网络），
![](/assets/img/bastion/19.png)
![](/assets/img/bastion/20.png)
第二步：为UI元素添加动画：
![](/assets/img/bastion/21.png)
第四步：完善效果，增加按钮：
用一个双面渲染的球，拉大，作为背景天空球。然后OPEN 和 CLOSE 分别会触发BP_Motor中的 Event 来展现物体的效果。
效果：
![](/assets/img/bastion/22.png)
![](/assets/img/bastion/23.gif)

参考：

Bastion effect:https://www.youtube.com/watch?v=SSt2ypkAXeM
UE4 vertex shader:https://www.youtube.com/watch?v=KyvndFgepBU



---
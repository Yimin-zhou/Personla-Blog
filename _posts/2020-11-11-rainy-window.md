---
date: 2020-11-11 23:48:05
layout: post
title: 雨天窗户Shader
subtitle: 一个下雨天窗户效果
description: >-
  在Unity实现的一个下雨天窗户效果
image: /assets/img/cover/rain.gif
category: 效果
tags:
  - shader
  - unity
  - archive
---

参考ShaderToy上的shader在Unity中实现雨滴效果

## 过程

### 1.将UV分为小的网格：

用 frac() 将UV分为多个小的网格，_Size值可以改变网格个数。

``` bash
 //make a grid, set origin to center
 float2 aspect = float2(2,1);
 float2 uv = i.uv*_Size*aspect;
 float2 gv = frac(uv)-0.5; 
```

![](/assets/img/1-Unity-rain/0.png)


### 2.在中心生成一个圆形的雨滴：

用smoothstep在每个格子中间生成一个小圆。

``` bash
float drop = smoothstep(0.05,0.03,length(dropPos)); //distance to cell center
```

利用sin() 和 Time.y 让雨滴向Y轴负方向运动：（雨滴移动的同时向下移动网格，当雨滴向上移动时看起来像是在窗户上停留了一段时间）

``` bash
float T = _Time.y;
//make drops dont go up
uv.y += T*_StayTime;
//drop movement
 float x = 0;
 float y = -sin(T+sin(T+sin(T)*0.5))*0.45; //这个函数在下落时速度较快 
 float2 dropPos = (gv-float2(x,y)) / aspect;
```




### 3.生成雨滴留下的痕迹：

在大雨滴后生成小雨滴。

``` bash
//create drop trail
float2 trailPos = (gv-float2(x,T*_StayTime))/aspect;
trailPos.y = (frac(trailPos.y*8)-0.5)/8;   //生成小圆（在每个格子中分割Y轴）
float trail = smoothstep(0.02,0.01,length(trailPos));
trail *= smoothstep(-0.05, 0.05, dropPos.y);//small drops lower than -0.05 will disappear
trail *= smoothstep(0.5,y,gv.y);//gradient, y is where main drop at
```

![](/assets/img/1-Unity-rain/2.png)


### 4.改进雨滴运动轨迹：

x 和 y 上用两个函数模拟雨滴轨迹（可在desmos中看函数形状）

``` bash
//drop movement
float w = i.uv.y*10;
//两个函数，模拟雨滴轨迹
float x = sin(3*w)*pow(sin(w),6)*0.45;
float y = -sin(T+sin(T+sin(T)*0.5))*0.45;
y -= gv.x*gv.x;         //lower part wider 让雨滴没那么圆
 
float2 dropPos = (gv-float2(x,y)) / aspect;
```



随机化每个格子里的时间：

``` bash
//get random numbers
float noise(float2 p)
{
 p = frac(p*float2(123.34, 345.45));
 p += dot(p, p+34.345);
 return frac(p.x*p.y);
}
 
//……………………………………
 
float T = fmod(_Time.y+_StayTime,7200); //make sure doesnt go too big
//…………
//create grid
//…………

float2 id = floor(uv);// cell id
                
//get number between 0,1, depends on each cell
float n = noise(id);
T += n*6.2831;//times 2PI to get more obvious random in sin() (T=2PI)
```

![](/assets/img/1-Unity-rain/4.png)

随机化每个格子中x的偏移：
（确保不会偏移出格子）

``` bash
float x = (n-0.5)*0.8; //random number -0.4 to 0.4
x += (0.4-abs(x)) * sin(3*w)*pow(sin(w),6)*0.45;
……
 y -= (gv.x-x)*(gv.x-x);  

```

改进雨滴痕迹：

``` bash
float fogtrail = smoothstep(-0.05, 0.05, dropPos.y);//small drops lower than -0.05 will disappear
fogtrail *= smoothstep(0.5,y,gv.y);//gradient
trail *= fogtrail;
fogtrail *= smoothstep(0.05,0.04, abs(dropPos.x));//not show trail at left and right
```




### 5.加入texture，偏移uv，查看效果：

雨滴加入distortion效果

``` bash
float2 offs = drop*dropPos + trail*trailPos;
col = tex2D(_MainTex, i.uv+offs*_Distortion);
```

![](/assets/img/1-Unity-rain/7.png)

修改代码，通过显示mipmap产生模糊的效果：
（fogTrail位置不模糊）

``` bash
float blur = _Blur * 7*(1-fogtrail);
col = tex2Dlod(_MainTex, float4(i.uv+offs*_Distortion,0,blur));  // set mipmap to blur texture
```




### 6.更多的雨滴：

（将代码放入一个方程layer， 返回一个float3， xy为uv偏移offs，z为fogtrail）
每加一层雨滴偏移下uv， 效果更好。


``` bash
//……
float3 drops = layer(i.uv, T);
drops += layer(i.uv*1.2+6, T);
drops += layer(i.uv*1.4+3, T);
drops += layer(i.uv*1.5-8, T);
//……
```

![](/assets/img/1-Unity-rain/10.png)


### 7. 可以用一个摄像机的render texture模仿透明效果：

用grabpass不生成mipmap,做模糊的话消耗较大
(要对每一个像素用周围的像素做均值处理)




## 最终结果

![](/assets/img/1-Unity-rain/12.png)

参考:
shaderToy “HeartLeft”: https://www.shadertoy.com/view/ltffzl

---
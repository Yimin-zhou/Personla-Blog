---
date: 2020-11-11 23:48:05 +0300
layout: post
title: Rainy Effect Shader
description: >-
  A Rainy Window implemented in Unity
image: assets\img\cover\rain.gif

tags: [project]
---

Based on shaders on ShderToy.
## Process

### 1.Dividing UV into smaller grids：

Use frac() to divide the UV into smaller grids. Parameter _Size can change the number of grids.

``` bash
 //make a grid, set origin to center
 float2 aspect = float2(2,1);
 float2 uv = i.uv*_Size*aspect;
 float2 gv = frac(uv)-0.5; 
```

![](/assets/img/1-Unity-rain/0.png)


### 2.Generate a circular raindrop in the center：

Use smoothstep to generate a small circle in the middle of each grid.

``` bash
float drop = smoothstep(0.05,0.03,length(dropPos)); //distance to cell center
```

Use sin() and Time.y to move the raindrops in the negative direction of the y-axis: (the raindrops move down the grid at the same time as they move up, so that when they move up it looks like they stay on the window for a while)

``` bash
float T = _Time.y;
//make drops dont go up
uv.y += T*_StayTime;
//drop movement
 float x = 0;
 float y = -sin(T+sin(T+sin(T)*0.5))*0.45; //这个函数在下落时速度较快 
 float2 dropPos = (gv-float2(x,y)) / aspect;
```




### 3.Generate the traces left by raindrops：

Generate tiny raindrops after large raindrops.

``` bash
//create drop trail
float2 trailPos = (gv-float2(x,T*_StayTime))/aspect;
trailPos.y = (frac(trailPos.y*8)-0.5)/8;   //生成小圆（在每个格子中分割Y轴）
float trail = smoothstep(0.02,0.01,length(trailPos));
trail *= smoothstep(-0.05, 0.05, dropPos.y);//small drops lower than -0.05 will disappear
trail *= smoothstep(0.5,y,gv.y);//gradient, y is where main drop at
```

![](/assets/img/1-Unity-rain/2.png)


### 4.Improve raindrop trace:

Simulate the raindrop trace with two functions on x and y directions (you can check the function shape in Desmos.com)

``` bash
//drop movement
float w = i.uv.y*10;
// two functions to simulate raindrop trajectories
float x = sin(3*w)*pow(sin(w),6)*0.45;
float y = -sin(T+sin(T+sin(T)*0.5))*0.45;
y -= gv.x*gv.x;         //lower part wider
 
float2 dropPos = (gv-float2(x,y)) / aspect;
```



Randomize the time in each cell.

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

Randomize the offset of x in each cell.
(ensuring no offset out of the cell)

``` bash
float x = (n-0.5)*0.8; //random number -0.4 to 0.4
x += (0.4-abs(x)) * sin(3*w)*pow(sin(w),6)*0.45;
……
 y -= (gv.x-x)*(gv.x-x);  

```

``` bash
float fogtrail = smoothstep(-0.05, 0.05, dropPos.y);//small drops lower than -0.05 will disappear
fogtrail *= smoothstep(0.5,y,gv.y);//gradient
trail *= fogtrail;
fogtrail *= smoothstep(0.05,0.04, abs(dropPos.x));//not show trail at left and right
```




### 5.Add texture：

Distortion Effect

``` bash
float2 offs = drop*dropPos + trail*trailPos;
col = tex2D(_MainTex, i.uv+offs*_Distortion);
```

![](/assets/img/1-Unity-rain/7.png)

Modify the code to produce a blurring effect.
(fogTrail position is not blurred)

``` bash
float blur = _Blur * 7*(1-fogtrail);
col = tex2Dlod(_MainTex, float4(i.uv+offs*_Distortion,0,blur));  // set mipmap to blur texture
```




### 6.More raindrops:

(put the code into an equation layer, return a float3, xy is uv offset offs, z is fogtrail)
Each layer of raindrops offset by uv, the effect is better.


``` bash
//……
float3 drops = layer(i.uv, T);
drops += layer(i.uv*1.2+6, T);
drops += layer(i.uv*1.4+3, T);
drops += layer(i.uv*1.5-8, T);
//……
```

![](/assets/img/1-Unity-rain/10.png)


Mimic the transparency effect with a camera render texture：
## 最终结果

![](/assets/img/1-Unity-rain/12.png)

Reference:
shaderToy “HeartLeft”: https://www.shadertoy.com/view/ltffzl

---
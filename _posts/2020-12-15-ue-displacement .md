---
date: 2020-12-15 23:48:05
layout: post
title: UE Displacement Shader
description: >-
  Experiments with Displacement effects in Unreal
image: assets\img\cover\dis.gif
tags: [project]
---

## Process

### Ideas:

Use `VertexNormalWS` in the material editor to get the coordinates of the vertex normals in world space.
The vertex normals are multiplied by a Displacement value before they are inserted into world displacement (for control).
Multiply with a Displacement map (0 for the black area, not misaligned; 1 for the white area, misaligned).

### 1：

Obtain the vertex normal coordinates (displacement direction), multiply with Displacement (displacement magnitude).

![](/assets/img/2-UE-DISPLACEMENT/1.png)

### 2：

Multiply with the Displacement map to get the desired dislocation area.

![](/assets/img/2-UE-DISPLACEMENT/2.png)


### 3：

The effect.

![](/assets/img/2-UE-DISPLACEMENT/3.png)


## Making puddles：

## Ideas：

Based on the pixel height in model space (z-axis direction) and a threshold value to determine if it should be a puddle.
Normal map is not applied to the puddle (flat).

### 1：

Get the world coordinates of the z-axis and subtract a WaterLevel value to control the water surface height, and subtract a model world coordinate (using the model coordinate origin as the water surface height origin).

![](/assets/img/2-UE-DISPLACEMENT/4.png)
![](/assets/img/2-UE-DISPLACEMENT/5.png)

### 2：

Divide the result of the previous step by a FallOff value to get a smoother transition (to be done before clamp, e.g. the original value is 1, 1/10 = 0.1 to get a transition value between 0 and 1). Use Clamp to ensure that the value does not exceed 0-1. Use the result after Clamp to do Lerp on the water color and the mapping color.
(the result of 0 (below WaterLevel) is shown as water color, the result of 1 shows the mapping color).

![](/assets/img/2-UE-DISPLACEMENT/6.png)
![](/assets/img/2-UE-DISPLACEMENT/7.png)

### 3：

Again, the normal map and the original plane normal are lerp (to flatten the water surface) using the post-Clamp values.
The water surface roughness is lerp with the roughness map using the same value after Clamp, and the water surface roughness is low.

![](/assets/img/2-UE-DISPLACEMENT/8.png)
![](/assets/img/2-UE-DISPLACEMENT/9.png)
![](/assets/img/2-UE-DISPLACEMENT/10.png)

### 4:

Sampling of world space locations as UV.
Different objects with the same texture can be matched seamlessly.
Get the world position of each pixel, take only xy, use a Divide normalize, multiply it by Tilling as UV and connect it to the texture sampler node (UVs are connected to one by default if there is no connection node)
texcoord node).

![](/assets/img/2-UE-DISPLACEMENT/11.png)
![](/assets/img/2-UE-DISPLACEMENT/12.png)

### 4:

Control of the fine surface curvature.
Increases the slenderness according to the camera position.
-Get the actor position, calculate the position with the camera (normalize), use 1-x, multiply the tessellation parameter to access the tessellation multiplier on the master node.
![](/assets/img/2-UE-DISPLACEMENT/13.png)
![](/assets/img/2-UE-DISPLACEMENT/14.png)
![](/assets/img/2-UE-DISPLACEMENT/15.png)

---
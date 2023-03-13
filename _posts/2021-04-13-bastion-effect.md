---
date: 2021-04-13 23:48:05
layout: post
title: Bastion effect
description: >-
  Bastion effect in UE.
image: assets\img\cover\iron.gif
tags: [project]
---

# Target effect
Show object detail parts appearing assembled (similar to going from scale 0 to scale 1).
Show object wireframe effect.
Interface to show UI.

# Process
Step 1: Start with a bunch of cube to implement and test the effect.
![](/assets/img/bastion/1.png)
Make a simple Vertex shader using the World postion offset in Unreal's material editor:
![](/assets/img/bastion/2.png)
The general principle is to offset the vertices from center to edge or edge to center, for now, manually with one parameter for control.
![](/assets/img/bastion/3.png)
![](/assets/img/bastion/4.png)
Add another effect similar to the one in the game Bastion, where the effect changes from a zoomed appearance to a displaced appearance.
![](/assets/img/bastion/5.png)
Also implemented in the Vertex shader, where the current position of the object is multiplied by a float3 to control the orientation (default z-axis), and a parameter is used to temporarily control the displacement manually.
![](/assets/img/bastion/6.png)
![](/assets/img/bastion/7.png)
Add these two effects together and connect them to the World postion offset, after that you can control these two parameters separately in the blueprint to achieve the overall effect.

Note: Scale_ parameter defaults to 0(0-1) and Position_ parameter defaults to 3(0-3), which is the initial state to show the effect animation when changing parameters.

## Wireframe effects
First get the world space coordinates of each pixel (get the "partition"), subtract the object position, then Fmod with one parameter to get more coordinates "partition".
![](/assets/img/bastion/8.png) (pre-Fmod effect)! [](/assets/img/bastion/9.png) (after Fmod)
After subtracting with one parameter, only the "divider" will be left, and then dot multiply with 1 to get a grid "mask" 
![](/assets/img/bastion/10.png)
![](/assets/img/bastion/11.png)
The approximate effect of multiplying with self-illumination.
! [](/assets/img/bastion/12.png)
But the above wireframe effect is not good, the wireframe will move when the object moves.

It is better to make an effect based on the model's own wireframe: !
Check Wireframe directly in the material to get a wireframe effect: !
![](/assets/img/bastion/13.png)
But this looks rather messy, and there are no other effects (such as lighting, etc.).
So add another model (two materials, the main difference is that one turns on wireframe and one doesn't). And the wireframe stacked together, is a pretty good wireframe grid effect.
![](/assets/img/bastion/14.png)

## The effect
The general idea is to use the blueprint to control the two previous parameters Scale_ and Position_, such as using Time line.
Step 1: Put the Scale and Position parameters shared by the two materials into the Material parameter collection.
![](/assets/img/bastion/15.png)
Also make another change to the material.

Create a blueprint with controls for Scale and Position.
![](/assets/img/bastion/16.png)
Create a Time line:
Use time to modify these two parameters to achieve an animation effect.
![](/assets/img/bastion/17.png)

Step 2: Modify the model used for display.
The current model is a whole, can not do the effect of a combination of various small parts, so in Maya with the extraction of the surface to select different parts (double-click on the surface selection will automatically select the face of the connected parts): !
![](/assets/img/bastion/18.png)
This, together with the previous effect, gives a nice overall effect.

## UI
Step 1: The general UI effect.
The interface is mainly divided into two parts, the main menu and the display interface.
First make the main menu, roughly a circle in the rotation, there is a start button in the middle, press it to load the level of the display vehicle, and with some animation (UI material from the network)
![](/assets/img/bastion/19.png)
![](/assets/img/bastion/20.png)
Step 2: Add animations to the UI elements.
![](/assets/img/bastion/21.png)
Step 4: Refine the effect and add buttons: !
Use a double-sided rendered ball, stretched out, as a background sky ball. Then OPEN and CLOSE will trigger an Event in BP_Motor to show the object's effect, respectively.
Effect.
![](/assets/img/bastion/22.png)
![](/assets/img/bastion/23.gif)

---
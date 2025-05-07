---
layout: post
title: 延迟渲染
description: >-
  一个在OpenGL中实现的简单的延迟渲染管线。
image: '/assets/img/deferred/1.jpg'
category: 渲染

---

在我的渲染器中我实现了一个延迟渲染pipeline. 在通常的前向渲染中，每一个需要渲染的物体都会对每一个光源每一个需要渲染的片段进行迭代，渲染的复杂度就是`O(Lights ∗ Objects)`, 传统的前向渲染中被遮挡的像素会在已经被渲染后才剔除，造成严重的overdraw[^1]. 前向渲染中不同的材质需要不同的shader（延迟渲染可以通过材质ID在同一个shader中渲染不同的材质）。
### 流程：
延迟渲染有两个主要阶段，geometry pass 和 lighting pass。在Geometry pass所有的几何信息和材质信息会被储存到G-buffer纹理当中，lighting pass会利用这些信息计算光照。这样最后实际计算渲染就只有最顶层的像素。
### Geometry pass
在Geometry pass中不需要对几何材质信息做过多的处理，在shader中可以同时存入MRT（multi render target），也就是Gbuffer的附件（attachment）贴图中。注意在Opengl中attachment的index和shader中的index需要对应，比如position attachment的index是0，在shader中的location也要是0：`layout (location = 0) out vec4 gWorlPos;`
### G-Buffer:
G缓冲(G-buffer)是对所有用来储存光照相关的数据，并在最后的光照处理阶段中使用的所有纹理的总称。在OpenGL中我们创建一个Frame buffer object并且绑定多个渲染目标（贴图），其中包括世界坐标位置，世界坐标法线，Albedo，粗糙度金属度AO，自发光，深度模板值。其中深度模板需要是`GL_DEPTH_STENCIL_ATTACHMENT` 其他要作为 `GL_COLOR_ATTACHMENT`。GBuffer预览：
				![](/assets/img/deferred/3.png)
为了内存对齐，所有的贴图都采用的RGBA格式，其中位置和法线信息使用更高精度的32float，albedo和粗糙度金属度AO采用8位int（本身就是从8bit的贴图读取的，足够了）。
### Lighting pass
在光照处理阶段我们只需要采样geometry pass生成的几何材质信息贴图就可以得到光照计算的所有信息，同时再采样上一篇提到的PBR需要的预计算贴图，我们就可以和前向渲染一样进行PBR光照渲染。这里我是把最后的结果渲染到了一个屏幕大小的quad上。结果和前向渲染相同：![](/assets/img/deferred/2.png)

### 延迟渲染优缺点
#### 优点：
- 延迟渲染能够高效地处理场景中的多个光源，因为光照计算是在屏幕空间进行的，独立于场景的复杂度。减少多余的渲染计算。
- 方便后处理等效果制作。

#### 缺点：
- 储存Gbuffer内存开销大，对内存带宽有要求。
- 不支持透明物体混合，需要配合前向渲染。
- 对MSAA支持不好（开销太大，需要储存Gbuffer中的采样点太多）。

### 更多：
传统的延迟渲染已经能比前向渲染计算很多的光照数量了，但是现在每一个光源都要对于每一个像素进行计算，可以尝试tile-based延迟渲染。

### 参考：
[^1]: Deferred shading: https://www.cg.tuwien.ac.at/courses/Seminar/WS2010/deferred_shading.pdf
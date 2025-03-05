---
date: 2021-06-01 23:48:05
layout: post
title: 吉卜力风格化草地
subtitle: 风格化草地的简单实现
description: >-
  草地
image: /assets/img/cover/grass.gif
category: 渲染
hidden: true

---
# 目标效果：
- 吉卜力风格的草地，多种颜色混合。
- 顶点风力运动。

# 制作过程：
- 在材质中关闭切线空间法线，这样normal就是接收世界空间法线。
![](/assets/img/grass-ue/1.png)
- 将一个0，0，1的值连入Normal,同时关掉阴影，让草变得干净。
![](/assets/img/grass-ue/2.png)
- 效果：
![](/assets/img/grass-ue/3.png)
- 可以看到草太平了，通过在根部加一个深色的渐变来得到一个假阴影效果。
- 利用uv的v方向来做一个从下到上的渐变效果，需要草模型的UV延V方向排开。
![](/assets/img/grass-ue/4.png)
- 这个Gradient mask 乘上草的颜色，就得到了一个假阴影效果。
![](/assets/img/grass-ue/5.png)

- 参考吉卜力的风格，草地需要更多的颜色变化。
![](/assets/img/grass-ue/6.png)

- 用世界空间坐标来采样一张noise，通过参数来控制一下偏移和tile。
![](/assets/img/grass-ue/7.png)
- 将两个颜色用采样的noise进行混合。
![](/assets/img/grass-ue/8.png)
- 采样两次这个noise，不同的tile参数，不同的颜色，最后再混合到一起。
![](/assets/img/grass-ue/9.png)

- 颜色的话根据参考图来的话有一个深一点的绿色，一个浅一点的绿色，一个偏蓝的绿色和一个偏黄的绿色。
![](/assets/img/grass-ue/10.png)
- 这样的话就可以得到一个不错的效果。
![](/assets/img/grass-ue/11.png)

- 利用自带的SimpleGrassWind做出一个简单的风力效果。
![](/assets/img/grass-ue/12.png)

- 最后的效果。
![](/assets/img/grass-ue/13.gif)

- 这里主要是对风格化草的效果进行一个预研，之后会在Unity 里用代码再实现一次。



---
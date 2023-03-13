---
date: 2021-06-01 23:48:05
layout: post
title: Ghibli Stylized Grass
description: >-
  Ghibli Stylized Grass in Unreal
image: assets\img\cover\grass.gif
tags: [project]
---
# Target effect.
- Ghibli style grass with multiple color blends.
- Vertex wind motion.

# Production process.
- Turn off tangent space normals in the material so that grass is using world space normals.
![](/assets/img/grass-ue/1.png)
- Connect a value of 0, 0, 1 to Normal, and turn off shadows to make the grass clean.
![](/assets/img/grass-ue/2.png)
- Effect.
![](/assets/img/grass-ue/3.png)
- You can see that the grass is too flat, by adding a dark gradient to the roots to get a fake shadow effect.
- Use the v-direction of the uv to make a bottom-to-top gradient effect, which requires the UV of the grass model to be lined up in the v-direction.
![](/assets/img/grass-ue/4.png)
- This Gradient mask is multiplied by the color of the grass to get a fake shadow effect.
![](/assets/img/grass-ue/5.png)

- Referring to Ghibli's style, the grass needs more color variation.
![](/assets/img/grass-ue/6.png)

- Sample a noise with world space coordinates, control the offset and tile a bit with parameters.
![](/assets/img/grass-ue/7.png)
- Blend the two colors with the sampled noise.
![](/assets/img/grass-ue/8.png)
- Samples this noise twice, with different tile parameters and different colors, and finally blends them together again.
![](/assets/img/grass-ue/9.png)

- The colors are a darker green, a lighter green, a bluish green and a yellowish green according to the reference image.
![](/assets/img/grass-ue/10.png)
- This will give you a nice effect.
![](/assets/img/grass-ue/11.png)

- Make a simple wind effect with the included SimpleGrassWind.
![](/assets/img/grass-ue/12.png)

- The final effect.
![](/assets/img/grass-ue/13.gif)




---
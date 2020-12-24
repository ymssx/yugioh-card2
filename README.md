# Card.js v2

<a href="./mold.js">参考mold.js</a>

初步方案（求建议）

1. 目标 => 用一个mold.js能够完全渲染出一个静态图片
2. 保持核心代码纯粹，尽量不要加入游戏王的相关逻辑
3. 数据处理部分写在`dataProcess`中，保证具体业务逻辑可插拔
4. render函数能保证在node和browser兼容，且无其他无关逻辑
5. fileLoader内部对图片素材进行必要的缓存
6. fontLoader可以参考<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/FontFace">FontFace</a>，兼容手段可以参考cardjs v1代码
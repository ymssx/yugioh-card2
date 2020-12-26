// 以模板为对象

export default {
  name: 'yugioh 11th mold',
  data: {
    id: '10000',
    name: '青眼白龙',
    attribute: 'light',
    level: 8,
    type: ['monster', 'normal'],
    attack: 100,
    // ...
  },
  // 最好是纯函数
  dataProcess: [
    data => ({
      ...data,
      frameName: data.type[0] === 'monster' ? `${data.type[0]}-${data.type[1]}` : data.type[0],
    }),
  ],
  resource: {
    images: {
      frames: {
        spell: './src/ygo/resource/frame/spell.jpg',
        'monster-normal': './src/ygo/resource/frame/monster_tc.jpg',
        'monster-xyz': './src/ygo/resource/frame/monster_cl.jpg',
      },
      attributes: {
        light: './src/ygo/resource/attribute/cn/light.png',
        dark: './src/ygo/resource/attribute/cn/dark.png',
      },
      star: {
        level: './src/ygo/resource/star/level.png',
        rank: './src/ygo/resource/star/rank.png',
      },
    },
    fonts: {
      name: './src/ygo/resource/font/cn.ttf',
    },
  },
  layout: {
    name: '卡模',
    type: 'image',
    src: (data, resource) => resource.images.frames[data.type[0] === 'monster' ? `${data.type[0]}-${data.type[1]}` : data.type[0]],
    style: {
      x: 0,
      y: 0,
      width: 813,
      height: 1185,
    },
    childrens: [
      {
        // 以下所有属性都可以是函数
        // Card会自动收集依赖并计算
        name: '卡名',
        type: 'text',
        text: data => data.name,
        style: {
          x: 65,
          y: 115,
          width: 610,
          font: 'name',
          fontSize: 65,
          color: data => data.type[0] === 'monster' ? 'black' : 'white',
        },
      },
      {
        name: '属性球',
        type: 'image',
        direct: true,
        src: (data, resource) => resource.images.attributes[data.attribute],
        style: {
          x: 680,
          y: 57,
          width: 75,
          height: 75,
        },
      },
      {
        name: '等级',
        type: 'image',
        src: (data, resource) => resource.images.star[data.type[1] === 'xyz' ? 'rank' : 'level'],
        // 重复次数
        repeat: data => data.level,
        if: data => data.type[0] === 'monster',
        style: {
          // index: 重复索引
          x: (data, _, index) => {
            return data.type[1] === 'xyz' ?
              (60 + index * 55) :
              (686 - index * 55);
          },
          y: 145,
          width: 50,
          height: 50,
        },
      },
      {
        name: '卡图',
        type: 'image',
        direct: true,
        src: data => `http://115.159.193.88:1803/public/pics/500/${data.id}.jpg`,
        style: {
          x: 100,
          y: 219,
          width: 614,
          height: 616,
        },
      },
    ]
  }
};

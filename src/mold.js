// 以模板为对象

export default {
  name: 'yugioh 11th mold',
  data: {
    id: '581014',
    name: '大薰风骑士 翠玉',
    attribute: 'wind',
    level: 4,
    type: ['monster', 'normal'],
    attack: 1800,
    defend: 1700,
    // ...
  },
  // 最好是纯函数
  dataProcess: [
    data => ({
      ...data,
      frameName: data.type[0] === 'monster' ? `${data.type[0]}-${data.type[1]}` : data.type[0],
    }),
  ],
  resourceBase: './src/ygo/resource',
  resource: {
    images: {
      frames: {
        spell: '@/frame/spell.jpg',
        'monster-normal': '@/frame/monster_tc.jpg',
        'monster-xyz': '@/frame/monster_cl.jpg',
      },
      attributes: {
        light: '@/attribute/cn/light.png',
        dark: '@/attribute/cn/dark.png',
        wind: '@/attribute/cn/wind.png',
      },
      star: {
        level: '@/star/level.png',
        rank: '@/star/rank.png',
      },
    },
    fonts: {
      name: '@/font/cn.ttf',
      number: '@/font/number.ttf',
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
      // 因为攻击防御有许多相同属性，可以将相同部分合并
      {
        type: 'text',
        style: {
          y: 1107,
          width: 72,
          font: 'number',
          fontSize: 36,
          textAlign: 'right',
        },
        inherit: [
          {
            name: '攻击力',
            text: data => data.attack,
            style: { x: 585 },
          },
          {
            name: '防御力',
            text: data => data.defend,
            style: { x: 750 },
          },
        ],
      },
      {
        type: 'text',
        style: {
          y: 1107,
          width: 72,
          font: 'number',
          fontSize: 36,
          textAlign: 'right',
        },
        inherit: [
          {
            name: 'ATK',
            text: 'ATK/',
            style: { x: 513 },
          },
          {
            name: 'DEF',
            text: 'DEF/',
            style: { x: 678 },
          },
        ],
      },
    ]
  }
};

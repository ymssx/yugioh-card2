// 以模板为对象

export default {
  name: '11th mold',
  // 需要用到的数据
  data: {
    id: '1000',
    name: '青眼白龙',
    type: [],
    linkArrows: [1, 1, 1, 1, 1, 1, 1, 1],
  },
  // 数据加工函数，最终访问到的data是处理后的数据
  dataProcess: [
    data => ({
      ...data,
      _frameName_: `${data.type[0]}-${data.type[1]}`,
      _linkArrowsNum_: data.linkArrows.reduce((num, arrow) => {
        num += arrow ? 1 : 0;
        return num;
      }, 0),
    }),
  ],
  // 需要用到资源
  resourceBase: '',
  resource: {
    fonts: {
      name: '@/cn.ttf',
      number: '@/number.ttf',
    },
    images: {
      frame: {
        monster: {
          normal: '@/frame/monster-normal.jpg',
          effect: '@/frame/monster-effect.jpg',
        },
        trap: 'xxx',
        spell: 'xxx',
      },
      attribute: {
        light: 'xxx',
      },
    },
  },
  // 定义如何绘制
  layout: {
    name: '卡模',
    type: 'image',
    // 规定资源获取方式，函数或字符串
    src: (data, resource) => {
      return resource.frame[data._frameName_];
    },
    rely: ['type'],
    opacity: false,
    style: {
      width: 813,
      height: 1185,
      x: 0,
      y: 0,
    },
    children: [
      {
        name: '卡名',
        type: 'text',
        text: data => data.name,
        lang: 'cn',
        mode: 'one-line',
        style: {
          font: 'name',
          x: 100,
          y: 100,
          width: 700,
        },
      },
      {
        name: '卡图',
        type: 'image',
        direct: true,
        src: data => `xxx/${data.id}.jpg`,
        style: {
          x: 100,
          y: 100,
          width: 500,
          height: 500,
        },
      },
      {
        name: '等级',
        type: 'image',
        src: data => `xxx/${data.type[2] === 'xyz' ? 'rank' : 'star'}.png`,
        // 重复次数
        repeat: data => data.level,
        style: {
          // index: 重复索引
          x: (data, _, index) => {
            return data.type[2] === 'xyz' ?
              (60 + index * 60) :
              (600 - index * 60);
          },
          y: 200,
          width: 50,
          height: 50,
        },
      },
      {
        name: '效果',
        type: 'text',
        text: data => data.desc,
        maxLine: 6,
        lang: 'cn',
        style: {
          x: 40,
          y: 500,
          width: 600,
          height: 100,
        },
      },
      {
        name: '灵摆效果',
        type: 'text',
        text: data => data.pendulumDesc,
        maxLine: 5,
        // 绘制条件
        if: data => data.type[3] === 'pendulum',
        lang: 'cn',
        style: {
          x: 100,
          y: 400,
          width: 400,
          height: 100,
        },
      },
      {
        name: '攻击栏 横线',
        type: 'custom',
        style: {
          x: 400,
          y: 50,
          width: 600,
        },
        render: (data, resource, canvas, component) => {
          // 自定义绘图逻辑
        }
      },
    ],
  },
};

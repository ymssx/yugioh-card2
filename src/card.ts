// entry

import { Resource, Component } from './const';

interface Config {
  name: string;
  data: object;
  resource: Resource;
  layout: Component;
}

export default class Card {
  config: Config;
  watchSet: Set<string>;
  relyMap: object;
  data: object;
  resource: Resource;
  layout: Component;
  imageLoader: Function;
  fontLoader: Function;
  canvas: HTMLCanvasElement;

  constructor(data: object, config: Config, { size }) {
    const that = this;

    this.config = config;

    this.watchSet = new Set();
    this.data = new Proxy(data, {
      get(origin, key: string) {
        that.watchSet.add(key);
        return origin[key];
      },
      set(origin, key: string, value) {
        if (that.watchSet.has(key)) {
          that.update(key);
        }

        origin[key] = value;
        return true;
      },
    });

    const getComponetProxy = (componnet: Component) => {
      return new Proxy(componnet, {
        get(origin, key) {
          if (key === 'childrens') {
            return origin.childrens.map((item: Component) => getComponetProxy(item));
          }

          if (key === 'style') {
            return new Proxy(origin.style, {
              get(style, key: string) {
                // 实际需要尺寸和模板尺寸可能不一致
                // 自动缩放比例
                if (['width', 'height', 'x', 'y', 'fontSize'].includes(key)) {
                  return (size / config.layout.style.width) * style[key];
                }

                // 自动获取字体路径
                if (key === 'fontSrc') {
                  return config.resource.fonts[style.font];
                }

                return style[key];
              },
            });
          }

          return origin[key];
        },
      });
    };
    this.layout = getComponetProxy(config.layout);
    this.ansysComponentRely();
  }

  ansysComponentRely() {
    this.relyMap = {};
    const walkComponent = (component: Component) => {
      const rely = component.rely;
      rely.forEach((relyKey: string) => {
        if (!this.relyMap[relyKey]) {
          this.relyMap[relyKey] = new Set();
        }
        this.relyMap[relyKey].add(component);
      });
      component.childrens.forEach((componentItem: Component) => walkComponent(componentItem));
    };
    walkComponent(this.layout);
  }

  update(key: string) {
    console.log(`${key} has changed! begin rerender.`);
  }
}

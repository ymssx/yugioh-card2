// entry

import { Resource, Component } from './const';

interface Config {
  name: string;
  data: object;
  resource: Resource;
  layout: Component;
}

interface otherConfig {
  size?: number;
}

export default class Card {
  config: Config;
  otherConfig: otherConfig;
  relyMap: Map<string, Set<Component>>;
  data: object;
  resource: Resource;
  layout: Component;
  canvas: HTMLCanvasElement;
  currentComponent: Component | null;

  constructor(canvas: HTMLCanvasElement, config: Config, otherConfig: otherConfig) {
    const that = this;

    this.canvas = canvas;
    this.config = config;
    this.resource = config.resource;
    this.otherConfig = otherConfig;

    this.currentComponent = null;
    this.relyMap = new Map();
    this.data = new Proxy(this.config.data, {
      get(origin, key: string) {
        if (that.currentComponent) {
          if (!that.relyMap.has(key)) {
            that.relyMap.set(key, new Set());
          }
          that.relyMap.get(key)?.add(that.currentComponent);
        }
        
        // dataProcess 处理一下
        // todo
        return origin[key];
      },
      set(origin, key: string, value) {
        if (that.relyMap.has(key)) {
          that.update(key);
        }

        origin[key] = value;
        return true;
      },
    });

    const getComponetProxy = (componnet: Component): Component => {
      return new Proxy(componnet, {
        get(origin, key) {
          that.currentComponent = origin;

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
  }

  update(key: string) {
    console.log(`${key} has changed! begin rerender.`);
  }
}

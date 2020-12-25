// entry

import { Resource, Component, Config } from './const';
import render from './render';

export interface CardInterface {
  canvas: HTMLCanvasElement;
  config: Config;
  size: number;
}

export default class Card {
  config: Config;
  relyMap: Map<string, Set<Component>>;
  data: { [key: string]: any };
  resource: Resource;
  layout: Component;
  canvas: HTMLCanvasElement;
  currentComponent: Component | null;

  constructor({ canvas, config, size }: CardInterface) {
    const that = this;

    this.canvas = canvas;
    this.config = config;
    this.resource = config.resource;

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
        
        let finalData = origin;
        origin.dataProcess?.map((processFunc: Function) => {
          finalData = processFunc(finalData);
        });
        return finalData[key];
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
        get(origin, key: string) {
          that.currentComponent = origin;

          let targetValue = origin[key];
          if (targetValue instanceof Function) {
            targetValue = targetValue(that.data, that.resource);
          }

          if (key === 'childrens' && Array.isArray(targetValue)) {
            return targetValue.map((item: Component) => getComponetProxy(item));
          }

          if (key === 'style') {
            return new Proxy(targetValue, {
              get(style, key: string, receiver) {
                let targetStyle = style[key];
                if (targetStyle instanceof Function) {
                  targetStyle = targetStyle(that.data, that.resource);
                }

                // 实际需要尺寸和模板尺寸可能不一致
                // 自动缩放比例
                if (['width', 'height', 'x', 'y', 'fontSize'].includes(key)) {
                  return (
                    (size ? (size  / config.layout.style.width) : 1) * targetStyle
                  );
                }

                // 自动获取字体路径
                if (key === 'fontSrc') {
                  return config.resource.fonts[receiver.font ?? 'default'];
                }

                return targetStyle;
              },
            });
          }

          return targetValue;
        },
      });
    };
    this.layout = getComponetProxy(config.layout);
  }

  render() {
    render(this.canvas, this.layout);
  }

  update(key: string) {
    console.log(`${key} has changed! begin rerender.`);
  }
}

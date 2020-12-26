// entry

import { Resource, Component, Config } from './const';
import isNodeEnv from './utils/env';
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
          if (!isNodeEnv()) {
            that.update(key);
          }
        }

        origin[key] = value;
        return true;
      },
    });

    const getComponetProxy = (componnet: Component): Component => {
      return new Proxy(componnet, {
        get(origin, key: string) {
          that.currentComponent = getComponetProxy(origin);

          let targetValue = origin[key];
          if (targetValue instanceof Function) {
            targetValue = targetValue(that.data, that.resource, origin.repeatCount);
          }

          if (key === 'childrens' && Array.isArray(targetValue)) {
            return targetValue.map((item: Component) => getComponetProxy(item));
          }

          if (key === 'style') {
            return new Proxy(targetValue, {
              get(style, key: string, receiver) {
                let targetStyle = style[key];
                if (targetStyle instanceof Function) {
                  targetStyle = targetStyle(that.data, that.resource, origin.repeatCount);
                }

                // 实际需要尺寸和模板尺寸可能不一致
                // 自动缩放比例
                if (typeof targetStyle === 'number') {
                  return (size ? size / config.layout.style.width : 1) * targetStyle;
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

  localRenderSet = new Set<Component>();
  needFullRender = false;
  reRenderRequest: number | null = null;
  update(key: string) {
    // 已经计划了全量更新，忽略更新请求
    if (this.needFullRender) {
      return;
    }

    if (this.reRenderRequest) {
      cancelAnimationFrame(this.reRenderRequest);
    }

    const updateSet = this.relyMap.get(key) ?? new Set();
    for (const component of updateSet) {
      if (!component.direct) {
        this.needFullRender = true;
        this.localRenderSet.clear();
        this.reRenderRequest = requestAnimationFrame(() => this.render());
        return;
      }
      this.localRenderSet.add(component);
      this.reRenderRequest = requestAnimationFrame(() => {
        for (const component of this.localRenderSet) {
          this.render(this.canvas, component);
        }
      });
    }
  }

  render(canvas = this.canvas, component = this.layout) {
    render(canvas, component);
    this.localRenderSet.clear();
    this.reRenderRequest = null;
    this.needFullRender = false;
  }
}

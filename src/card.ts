// entry

import { Resource, Component, Config } from './const';
import isNodeEnv from './utils/env';
import formatComponentObject from './utils/formatComponent';
import render from './render';

const defaultComponentValue: {
  [key: string]: any;
} = {
  if: true,
  direct: false,
  repeat: 1,
};

const defaultStyleValue: {
  [key: string]: any;
} = {
  color: 'black',
  fontSize: 12,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  textAlign: 'left',
};

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

    const getComponetProxy = (component: Component): Component => {
      return new Proxy(component, {
        get(origin, key: string) {
          that.currentComponent = getComponetProxy(origin);

          const targetValueOrigin = origin[key];
          let targetValue;
          if (targetValueOrigin instanceof Function) {
            targetValue = targetValueOrigin(that.data, that.resource, origin.repeatCount);
          } else {
            targetValue = targetValueOrigin;
          }

          if (defaultComponentValue.hasOwnProperty(key) && !origin.hasOwnProperty(key)) {
            return defaultComponentValue[key];
          }

          if (key === 'childrens' && Array.isArray(targetValue)) {
            return targetValue.map((item: Component) => getComponetProxy(item));
          }

          if (key === 'style') {
            return new Proxy(targetValue, {
              get(style, key: string, receiver) {
                const targetStyleOrigin = style[key];
                let targetStyle;
                if (targetStyleOrigin instanceof Function) {
                  targetStyle = targetStyleOrigin(that.data, that.resource, origin.repeatCount);
                } else {
                  targetStyle = targetStyleOrigin;
                }

                if (defaultStyleValue.hasOwnProperty(key) && !style.hasOwnProperty(key)) {
                  return defaultStyleValue[key];
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

    const formatComponent = formatComponentObject(config.layout);
    this.layout = getComponetProxy(Array.isArray(formatComponent) ? formatComponent[0] : formatComponent);
  }

  needFullRenderRequest: Boolean = false;
  fullRenderRequest: number | null = null;
  localRenderRequestMap = new Map<Component, number>();
  update(key: string) {
    // 当已计划全量更新时，不再受理更新请求
    if (this.needFullRenderRequest) {
      return;
    }

    const updateSet = this.relyMap.get(key) ?? new Set();
    for (const component of updateSet) {
      if (!component.direct) {
        // 引发全量更新
        this.needFullRenderRequest = true;
        if (this.fullRenderRequest) {
          cancelAnimationFrame(this.fullRenderRequest);
        }
        this.fullRenderRequest = requestAnimationFrame(async () => {
          await this.render();
          this.needFullRenderRequest = false;
        });

        // 所有局部更新请求localRenderRequestMap全部取消
        for (const request of this.localRenderRequestMap.values()) {
          cancelAnimationFrame(request);
        }
        this.localRenderRequestMap.clear();

        return;
      }

      const oldRenderRequest = this.localRenderRequestMap.get(component);
      if (oldRenderRequest) {
        cancelAnimationFrame(oldRenderRequest);
      }
      // 每个局部请求之间相互独立
      const renderRequest = requestAnimationFrame(async () => {
        await this.render(this.canvas, component);
        this.localRenderRequestMap.delete(component);
      });
      this.localRenderRequestMap.set(component, renderRequest);
    }
  }

  async render(canvas = this.canvas, component = this.layout) {
    await render(canvas, component);
  }
}

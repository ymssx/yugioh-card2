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
    
    const resourceBase = config.resourceBase ?? '';
    const formatResource = (resource: { [key: string]: any }) => {
      const newResource: { [key: string]: any } = {};
      for (const key in resource) {
        const target = resource[key];
        if (typeof target === 'string') {
          newResource[key] = target.split('@').join(resourceBase);
        } else {
          newResource[key] = formatResource(target);
        }
      }
      return newResource;
    };
    
    this.resource = {
      images: formatResource(config.resource.images),
      fonts: formatResource(config.resource.fonts),
    };

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
                  return that.resource.fonts[receiver.font ?? 'default'];
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

  needFullRender: Boolean = false;
  renderRequest: number | null = null;
  localRenderSet = new Set<Component>();
  update(key: string) {
    // 当已计划全量更新时，不再受理更新请求
    if (this.needFullRender) {
      return;
    }

    if (this.renderRequest) {
      cancelAnimationFrame(this.renderRequest);
    }

    const updateSet = this.relyMap.get(key) ?? new Set();
    for (const component of updateSet) {
      if (!component.direct) {
        // 引发全量更新
        this.needFullRender = true;
        this.renderRequest = requestAnimationFrame(async () => {
          this.render();
          this.localRenderSet.clear();
          this.renderRequest = null;
          this.needFullRender = false;
        });
        return;
      }

      this.localRenderSet.add(component);
    }
    this.renderRequest = requestAnimationFrame(() => {
      for (const componentItem of this.localRenderSet) {
        this.render(this.canvas, componentItem);
      }
      this.localRenderSet.clear();
      this.renderRequest = null;
      this.needFullRender = false;
    });
  }

  async render(canvas = this.canvas, component = this.layout) {
    await render(canvas, component);
  }
}

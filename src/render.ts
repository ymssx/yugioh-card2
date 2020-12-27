// function for rendering a component

import { Component, ComponentType } from './const';
import { imageLoader, fontLoader } from './fileLoader';

const renderMap = new Map<string, number>();

const getRenderFlag = (name: string) => {
  return renderMap.get(name) ?? 0;
};

const setRenderFlag = (name: string) => {
  const renderFlag = getRenderFlag(name) + 1;
  renderMap.set(name, renderFlag);
  return renderFlag;
};

const render = async (canvas: HTMLCanvasElement, component: Component): Promise<any> => {
  console.log(component.name)
  if (!component.if) {
    return;
  }

  const c = canvas.getContext('2d');
  if (!c) {
    return;
  }

  for (let index = 0; index < (component.repeat ?? 1); index += 1) {
    component.repeatCount = index;
    const { name, style, type, src, text = '', childrens = [] } = component;
    const { x, y, width, height, fontSrc, fontSize, color = 'black', textAlign = 'left' } = style;

    switch (type) {
      case ComponentType.image: {
        const flag = setRenderFlag(name);
        let image;
        const imageRes = imageLoader(src ?? '');
        if (imageRes instanceof Promise) {
          image = await imageRes;
          // 保证同一组件多次渲染的顺序正确
          if (getRenderFlag(name) > flag) {
            // 此绘制任务已失效
            return;
          }
        } else {
          image = imageRes;
        }

        c.drawImage(image, x, y, width, height);
        break;
      }
      case ComponentType.text: {
        const flag = setRenderFlag(name);
        let fontName;
        const fontNameRes = fontLoader(fontSrc ?? '');
        if (fontNameRes instanceof Promise) {
          fontName = await fontNameRes;
          if (getRenderFlag(name) > flag) {
            return;
          }
        } else {
          fontName = fontNameRes;
        }

        renderMap.set(name, (renderMap.get(name) ?? 0) + 1);
        c.font = `${fontSize}px ${fontName}`;
        c.fillStyle = color;
        c.textAlign = textAlign;
        c.fillText(text, x, y, width);
        break;
      }
      default:
        break;
    }

    const renderList = [];
    for (const componentItem of (component.childrens ?? [])) {
      renderList.push(render(canvas, componentItem));
    }

    await Promise.all(renderList);
  }

  return true;
};

export default render;

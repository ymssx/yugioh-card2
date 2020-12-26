// function for rendering a component

import { Component, ComponentType } from './const';
import { imageLoader, fontLoader } from './fileLoader';

const render = async (canvas: HTMLCanvasElement, component: Component): Promise<any> => {
  if (!component.if) {
    return;
  }

  const c = canvas.getContext('2d');
  if (!c) {
    return;
  }

  for (let index = 0; index < (component.repeat ?? 1); index += 1) {
    component.repeatCount = index;
    const { style, type, src, text = '', childrens = [] } = component;
    const { x, y, width, height, fontSrc, fontSize, color = 'black', textAlign = 'left' } = style;

    switch (type) {
      case ComponentType.image: {
        const image = await imageLoader(src ?? '');
        c.drawImage(image, x, y, width, height);
        break;
      }
      case ComponentType.text: {
        const fontName = await fontLoader(fontSrc ?? '');
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

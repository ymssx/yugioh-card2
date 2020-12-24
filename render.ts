// function for rendering a component

import { Component, ComponentType } from './const';
import { imageLoader, fontLoader } from './fileLoader';

const render = async (canvas: HTMLCanvasElement, component: Component) => {
  const { style, type, src, text, childrens } = component;
  const { x, y, width, height, font, fontSrc, fontSize, color } = style;

  const c = canvas.getContext('2d');

  switch (type) {
    case ComponentType.image: {
      const image = await imageLoader(src);
      c.drawImage(image, x, y, width, height);
    }
    case ComponentType.text: {
      await fontLoader(fontSrc);
      c.font = `${font} ${fontSize}`;
      c.fillStyle = color;
      c.fillText(text, x, y, width);
    }
    default:
      break;
  }

  const renderList = [];
  for (const componentItem of childrens) {
    renderList.push(render(canvas, componentItem));
  }

  return Promise.all(renderList);
};

export default render;

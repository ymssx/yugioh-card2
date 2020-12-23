// function for rendering card

import Card from './card';
import { Component, ComponentType } from './const';

const render = async (card: Card) => {
  const { resource, layout, imageLoader, fontLoader, canvas } = card;

  const renderComponent = async (c: CanvasRenderingContext2D, component: Component) => {
    const { style, type, src, text } = component;
    const { x, y, width, height, font, fontSize, color } = style;

    switch (type) {
      case ComponentType.image: {
        const image = await imageLoader(src);
        c.drawImage(image, x, y, width, height);
      }
      case ComponentType.text: {
        await fontLoader(resource.fonts[font]);
        c.font = `${font} ${fontSize}`;
        c.fillStyle = color;
        c.fillText(text, x, y, width);
      }
      default:
        break;
    }
  };

  const context = canvas.getContext('2d');
  const { src, childrens, style } = layout;

  const frame = await imageLoader(src);
  context.drawImage(frame, 0, 0, style.width, style.height);

  const renderList = [];
  for (const componentItem of childrens) {
    renderList.push(renderComponent(context, componentItem));
  }

  return Promise.all(renderList);
};

export default render;

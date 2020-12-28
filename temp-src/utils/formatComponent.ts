import { Component } from '../const';
import deepClone from './deepClone';

/**
component预解析
以下将会被拆分成两个component
{
  type: 'text',
  style: {
    y: 1107,
    width: 72,
    font: 'number',
    fontSize: 36,
    textAlign: 'right',
  },
  inherit: [
    {
      name: '攻击力',
      text: data => data.attack,
      style: { x: 585 },
    },
    {
      name: '防御力',
      text: data => data.defend,
      style: { x: 750 },
    },
  ],
},
 */
const formatComponentObject = (component: Component): Component | Component[] => {
  if (Array.isArray(component.childrens)) {
    let childrens: Component[] = [];
    for (const componentItem of component.childrens) {
      const formatComponent = formatComponentObject(componentItem);
      if (Array.isArray(formatComponent)) {
        childrens = childrens.concat(formatComponent)
      } else {
        childrens.push(formatComponent);
      }
    }
    component.childrens = childrens;
  }

  if (Array.isArray(component.inherit)) {
    return component.inherit.map((item: Component) => {
      const newComponent = deepClone(component) as Component;
      newComponent.inherit = undefined;

      const inheritObject = (targetObj: {[key: string]: any}, obj: {[key: string]: any}) => {
        for (const key in obj) {
          if (typeof obj[key] === 'object') {
            inheritObject(targetObj[key], obj[key]);
          } else {
            targetObj[key] = obj[key];
          }
        }
      }

      inheritObject(newComponent, item);
      return newComponent;
    });
  }

  return component;
};

export default formatComponentObject;

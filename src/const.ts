export enum ComponentType {
  image = 'image',
  text = 'text',
}

export interface Style {
  [key: string]: any;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSrc?: string;
  font?: string;
  fontSize?: number;
  color?: string;
}

export interface Resource {
  fonts: { [key: string]: any };
  images: { [key: string]: any };
}

export interface Component {
  [key: string]: any;
  name?: string;
  type: ComponentType;
  style: Style;
  src?: string;
  text?: string;
  childrens?: Component[];
}

export interface Config {
  name: string;
  data: { [key: string]: any };
  resource: Resource;
  layout: Component;
}

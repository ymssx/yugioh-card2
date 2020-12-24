export enum ComponentType {
  image = 'image',
  text = 'text',
}

export interface Style {
  x: number,
  y: number,
  width: number,
  height: number,
  fontSrc?: string,
  font?: string,
  fontSize?: number,
  color?: string,
}

export interface Resource {
  fonts: object;
  images: object;
}

export interface Component {
  name?: string;
  type: ComponentType;
  style: Style;
  src?: string;
  rely?: string[];
  text?: string;
  childrens?: Component[];
}

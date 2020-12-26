// load resources in Browser or Node

import isNodeEnv from './utils/env';
import md5 from 'md5-ts';

export const browserFontLoader = async (src: string) => {
  const fontFamily = `font-${md5(src)}`;
  // @ts-ignore
  const font = new FontFace(fontFamily, `url(${src})`);
  // @ts-ignore
  document.fonts.add(font);
  await font.load();
  return fontFamily;
};

export const nodeFontLoader = async (src: string) => {};

export const browserImageLoader = async (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export const nodeImageLoader = async (src: string) => {};

export const fontLoader = async (src: string) => {
  return await browserFontLoader(src);
};
export const imageLoader = async (src: string) => {
  // if (isNodeEnv()) {
  //   return await nodeImageLoader(src);
  // }
  return await browserImageLoader(src);
};

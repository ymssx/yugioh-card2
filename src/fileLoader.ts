// load resources in Browser or Node

import isNodeEnv from './utils/env';
import md5 from 'md5-ts';

const fontMap = new Map<string, string>();
export const browserFontLoader = async (src: string) => {
  if (fontMap.has(src)) {
    return fontMap.get(src);
  }

  const fontFamily = `font-${md5(src)}`;
  // @ts-ignore
  const font = new FontFace(fontFamily, `url(${src})`);
  // @ts-ignore
  document.fonts.add(font);
  await font.load();
  fontMap.set(src, fontFamily);
  return fontFamily;
};

export const nodeFontLoader = async (src: string) => {};

const imageMap = new Map<string, HTMLImageElement>();
// todo: 做localstorage持久化
export const browserImageLoader = async (src: string) => {
  if (imageMap.has(src)) {
    return imageMap.get(src);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img);
      imageMap.set(src, img);
    };
    img.onerror = reject;
  });
};

export const nodeImageLoader = async (src: string) => {};

export const fontLoader = (src: string) => {
  return browserFontLoader(src);
};
export const imageLoader = (src: string) => {
  // if (isNodeEnv()) {
  //   return nodeImageLoader(src);
  // }
  return browserImageLoader(src);
};

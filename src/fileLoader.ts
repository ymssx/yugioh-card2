// load resources in Browser or Node

import isNodeEnv from './utils/env';

export const browserFontLoader = async (src: string) => {};

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

export const fontLoader = async (src: string) => {};
export const imageLoader = async (src: string) => {
  // if (isNodeEnv()) {
  //   return await nodeImageLoader(src);
  // }
  return await browserImageLoader(src);
};

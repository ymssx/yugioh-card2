const deepClone = (target: { [key: string]: any }): any => {
  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      const result = [];
      for (let i in target) {
        result.push(deepClone(target[i]))
      }
      return result;
    } else if (target === null) {
      return null;
    } else if (target.constructor === RegExp){
      return target;
    } else {
      const result: { [key: string]: any } = {};
      for (let i in target) {
        result[i] = deepClone(target[i]);
      }
      return result;
    }
  } else {
    return target;
  }
}

export default deepClone;

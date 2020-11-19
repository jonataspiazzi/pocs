function moduleToFile(module: any) {
  return typeof module === 'string' ? module : module.default;
}

export const assets = {
  sample: moduleToFile(require('./sample.mp4'))
};
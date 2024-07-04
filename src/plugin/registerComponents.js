export default {
  install(Vue, options) {
    Vue.$registerComponents = Vue.prototype.$registerComponents = files => {
      const components = {};
      const fileNames = [];
      files.keys().forEach(file => {
        const fileName = file.replace("./", "").replace(".vue", "");
        fileNames.push(fileName);
        components[fileName] = files(file).default;
      });
      return { components, fileNames };
    };
  }
};

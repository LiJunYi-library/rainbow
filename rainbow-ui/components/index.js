
const element = {};
const componentsFiles = require.context('../components', true);
componentsFiles.keys().forEach(path => {
  if (/.\/[^\/]*?\/index.js/.test(path)) {
    const content = componentsFiles(path);
    const eles = content.default || {};
    for (const key in eles) {
      if (Object.hasOwnProperty.call(eles, key)) {
        const com = eles[key];
        element[key] = com;
      }
    }
  }
});
export default element;







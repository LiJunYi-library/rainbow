
const prototypes = {};
const componentsFiles = require.context('../prototype', true);
componentsFiles.keys().forEach(path => {
  if (/.\/[^\/]*?\/index.js/.test(path)) {
    const content = componentsFiles(path);
    const eles = content.default || {};
    for (const key in eles) {
      if (Object.hasOwnProperty.call(eles, key)) {
        const com = eles[key];
        prototypes[key] = com;
      }
    }
  }
});
export default prototypes;







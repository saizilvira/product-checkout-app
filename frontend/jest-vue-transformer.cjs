const vueJest = require('@vue/vue3-jest');
const babelJest = require('babel-jest').default.createTransformer({
  presets: [['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }]],
  plugins: [
    function () {
      return {
        visitor: {
          MetaProperty(path) {
            path.replaceWithSourceString('process')
          }
        }
      }
    }
  ]
});

module.exports = {
  process(src, filename, config, options) {
    const vueResult = vueJest.process(src, filename, config, options);
    const code = typeof vueResult === 'object' ? vueResult.code : vueResult;
    let result = babelJest.process(code, filename, config, options);
    
    let finalCode = typeof result === 'object' ? result.code : result;
    finalCode = finalCode.replace(/\n\/\/# sourceMappingURL=.*/, ''); // strip sourcemap to be safe
    finalCode += '\nif (exports.default && exports.render) { exports.default.render = exports.render; }\n';
    
    if (typeof result === 'object') {
        result.code = finalCode;
        return result;
    }
    return finalCode;
  }
};

const fs = require('fs');
const path = require('path');

class FileListPlugin {
  static defaultOptions = {
    outputFile: 'assets.md',
  };

  // 需要传入自定义插件构造函数的任意选项
  //（这是自定义插件的公开API）
  constructor(options = {}) {
    // 在应用默认选项前，先应用用户指定选项
    // 合并后的选项暴露给插件方法
    // 记得在这里校验所有选项
    this.options = { ...FileListPlugin.defaultOptions, ...options };
  }

  apply(compiler) {
    const pluginName = FileListPlugin.name;

    // webpack 模块实例，可以通过 compiler 对象访问，
    // 这样确保使用的是模块的正确版本
    // （不要直接 require/import webpack）
    const { webpack } = compiler;

    // Compilation 对象提供了对一些有用常量的访问。
    const { Compilation } = webpack;

    // RawSource 是其中一种 “源码”("sources") 类型，
    // 用来在 compilation 中表示资源的源码
    const { RawSource } = webpack.sources;

    // 绑定到 “thisCompilation” 钩子，
    // 以便进一步绑定到 compilation 过程更早期的阶段
    compiler.hooks.entryOption.tap(pluginName, (context, entry) => {
        console.log(context, '9999', entry);
    });
compiler.hooks.normalModuleFactory.tap(pluginName, (factory) => {
  factory.hooks.parser
    .for('javascript/auto')
    .tap(pluginName, (parser, options) => {
      parser.hooks.importSpecifier.tap(pluginName, (statement, source, exportName, identifierName) => {
          console.log(exportName, source, identifierName)
        });
    });
});
  }
}

module.exports = { FileListPlugin };
# fed-e-task-02-02
## 简答题

### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

（1）**初始化参数**
根据用户在命令窗口输入的参数以及 webpack.config.js 文件的配置，得到最后的配置。
（2）**开始编译**
根据上一步得到的最终配置初始化得到一个 compiler 对象，注册所有的插件 plugins，插件开始监听 webpack 构建过程的生命周期的环节（事件），不同的环节会有相应的处理，然后开始执行编译。
（3）**确定入口**
根据 webpack.config.js 文件中的 entry 入口，开始解析文件构建 AST 语法树，找出依赖，递归下去。

（4）**编译模块**
递归过程中，根据文件类型和 loader 配置，调用相应的 loader 对不同的文件做不同的转换处理，再找出该模块依赖的模块，然后递归本步骤，直到项目中依赖的所有模块都经过了本步骤的编译处理。

编译过程中，有一系列的插件在不同的环节做相应的事情，比如 UglifyPlugin 会在 loader 转换递归完对结果使用 UglifyJs 压缩覆盖之前的结果；再比如 clean-webpack-plugin ，会在结果输出之前清除 dist 目录等等。

（5）**完成编译并输出**
递归结束后，得到每个文件结果，包含转换后的模块以及他们之间的依赖关系，根据 entry 以及 output 等配置生成代码块 chunk。

（6）**打包完成**
根据 output 输出所有的 chunk 到相应的文件目录。

### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。
区别：

- Loader：Webpack 将一切文件视为模块，但是 webpack 原生是只能解析 js 文件，如果想将其他文件也打包的话，就会用到 loader。 所以 Loader 的作用是让 webpack 拥有了加载和解析非 JavaScript 文件的能力。
- Plugin：Plugin 可以扩展 webpack 的功能，让 webpack 具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

开发 Loader 的思路：
- 可以直接在项目根目录新建 test-loader.js （完成后也可以发布到 npm 作为独立模块使用）
- 这个文件需要导出一个函数，这个函数就是我们的 loader 对所加载到的资源的处理过程
- 函数输入为 加载到的资源，输出为 加工后的结果
- 输出结果可以有两种形式：第一，输出标准的 JS 代码，让打包结果的代码能正常执行；第二，输出处理结果，交给下一个 loader 进一步处理成 JS 代码
- 在 webpack.config.js 中使用 loader，配置 module.rules ，其中 use 除了可以使用模块名称，也可以使用模块路径

开发 Plugin 的思路：
- plugin 是通过钩子机制实现的，我们可以在不同的事件节点上挂载不同的任务，就可以扩展一个插件
- 插件必须是一个函数或者是一个包含 apply 方法的对象
- 一般可以把插件定义为一个类型，在类型中定义一个 apply 方法
- apply 方法接收一个 compiler 参数，包含了这次构建的所有配置信息，通过这个对象注册钩子函数
- 通过 compiler.hooks.emit.tap 注册钩子函数（emit也可以为其他事件），钩子函数第一个参数为插件名称，第二个参数 compilation 为此次打包的上下文，根据 compilation.assets 就可以拿到此次打包的资源，做一些相应的逻辑处理
  

### 编程思路：
yarn serve：便于开发

yarn build：发布之前生成最终代码

yarn lint：代码修改完后进行代码检查
common讲解
vuejs入口文件是main.js
输出到dist的bundle.js

- //vue文件 vue-loader
//js文件 babel-loader 主要是把ES6以后的语法转成ES5，兼容性好
//css文件 先执行css-loader 再执行vue-style-loader，这一步是对vue文件里的style部分进行编译
//less文件 先执行less-loader，再执行css-loader和style-loader，把less文件的样式部分转成css然后嵌入进html里
//png等图片文件 file-loader，复制到public路径，并且因为vue文件里有直接引用的路径，所以需要增加esModule: false的配置，否则file-loader会默认img src后面是require()的module，这样会导致最终代码是src=[object Module]
接下来是plugins

共用的部分是

HtmlWebpackPlugin：从public里使用index.html作为模板，嵌入我们提供的title和BASE_URL，然后webpack还会将生成的bundle.js自动嵌入进html里

VueLoaderPlugin：vue loader需要的，因为vue文件里包括template script style，如果有rule匹配到了/.js$/，也会对vue文件里的<script>部分执行，当然style也一样，这就解释了为什么css规则能解析vue文件里的style

### dev的部分
使用webpack-merge会自动合并参数和插件
mode：告诉webpack这是development，不要开启production的各种功能
devtool：使用哪种source map，这里使用cheap-module-source-map，速度要快一些，没有列信息
devServer：给webpack-dev-server的参数，hot: true，支持热更新
new webpack.HotModuleReplacementPlugin()也是为热更新服务的

### prod
mode：告诉webpack是production，开启treeshaking ugilfy功能

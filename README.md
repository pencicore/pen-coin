### 合约部分

合约使用 solidity 编写
1. 使用 remix ide 开发
2. 使用 remix ide 自带框架编写 solidity 合约代码进行测试
3. 使用 remix ide 自带 hardhat 框架，编写ts脚本部署合约
4. 使用 remix ide 官方提供 remixd 插件，同步本地与浏览器的合约代码

### 前端部分

前端部分使用 React + Vite 构建

组件使用
- ethers.js v6 框架
- react-router-dom 路由
- sass 样式
- zustand 变量管理
- react-toastify 提示框
- react-avatar 头像
- axios 请求框架

文件描述
- src/main.jsx 入口文件：渲染根组件, 不做任何更改
- src/App.jsx 根组件,：网页主体内容
- src/Common.css 通用样式：定义了网页大部分基础样式，由App.jsx引入，所有组件共用

### 后端部分

后端部分使用 go 搭建后端服务 并 监听链上事件

组件使用
- gin 路由管理
- gorm 数据库交互
- redis 缓存
- go-ethereum 链上交互与监听
- logrus 日志
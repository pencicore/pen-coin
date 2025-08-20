



### 前端部分

前端部分使用 React + Vite 构建

组件使用了
- react-router-dom 路由
- sass 样式
- zustand 变量管理
- react-toastify 提示框
- react-avatar 头像

编程套路
- 一个jsx文件，对应一个组件，对应一个css文件

文件描述
- src/main.jsx 入口文件：渲染根组件, 不做任何更改
- src/App.jsx 根组件,：网页主体内容
- src/Common.css 通用样式：定义了网页大部分基础样式，由App.jsx引入，所有组件共用
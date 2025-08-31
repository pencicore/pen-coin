### 合约部分

合约使用 solidity 编写
1. 使用 remix ide 开发
2. 使用 remix ide 自带框架编写 solidity 合约代码进行测试
3. 使用 remix ide 自带 hardhat 框架，编写ts脚本部署合约
4. 使用 remix ide 官方提供 remixd 插件，同步本地与浏览器的合约代码

### 前端部分

前端部分使用 React 构建, 对接后端服务 实现链上交互

组件使用
- vite 构建项目
- ethers.js v6 链上交互
- react-router-dom 路由
- sass 样式
- zustand 变量管理
- react-toastify 提示框
- react-avatar 头像
- axios 请求框架

### 后端部分

后端部分使用 go 搭建后端服务 并 监听链上事件

组件使用
- gin 路由管理
- gorm 数据库交互
- redis 缓存
- go-ethereum 链上交互与监听
- logrus 日志

### 脚本部分

使用 python 进行nft代币图像生成，并批量上传ipsf服务器，提供nft代币信息功能

python库使用
- Stable Diffusion 图像生成模型
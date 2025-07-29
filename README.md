# Electron 放松一下功能组件

这是一个独立的放松一下功能组件，可以在任何 Electron + Vue 3 项目中使用。

## 鸣谢

项目中示例视频 API 地址取自[遇见 Api](https://api.yujn.cn/),

良心站长，共收录了 370 个接口(截止 20250729 统计)，

并且还在持续更新维护中，大家觉得不错可以多多支持

## 🎯 功能特性

- 🎥 随机视频播放
- 💾 视频下载保存
- 🎨 水墨涟漪动画效果
- 📱 响应式设计
- 🌙 暗色主题支持
- ⚙️ 高度可配置

## 👀 大致效果

<video width="320" height="240" controls>
  <source src="https://halo-qingyun-webside.oss-cn-hangzhou.aliyuncs.com/fileshare-duqs/20250729_115416.mp4" type="video/mp4">
</video>

## 📦 安装

```bash
npm install relax-life-kit
```

## 🚀 快速开始

### 1. 主进程设置

在主进程的 `index.js` 中注册 IPC 处理程序：

```javascript
import { registerRelaxIpc } from "relax-life-kit";

app.whenReady().then(() => {
  // 注册放松一下的IPC处理程序
  registerRelaxIpc({
    filePrefix: "放松一下", // 可选：自定义文件前缀
  });

  // 其他初始化代码...
});
```

### 2. 渲染进程使用

在 Vue 组件中使用：

```vue
<template>
  <div>
    <!-- 触发按钮 -->
    <relax-button :loading="getRedirectUrlLoading" @click="handleRelaxClick" />

    <!-- 放松抽屉 -->
    <relax-drawer
      v-model:open="relaxOpen"
      v-model:get-redirect-url-loading="getRedirectUrlLoading"
      title="😎 放松一下,劳逸结合"
      video-api-url="https://api.yujn.cn/api/zzxjj.php?type=video"
    />
  </div>
</template>

<script setup>
import { RelaxDrawer, RelaxButton, useRelax } from "relax-life-kit";

// 使用组合式函数管理状态
const { relaxOpen, getRedirectUrlLoading, openRelax } = useRelax();

// 处理点击事件
const handleRelaxClick = () => {
  openRelax();
};

// 或者使用 ref 内部方法打开

const relaxDrawerRef = ref(null);

const open = () => {
  relaxDrawerRef.value?.handleOpenRelax();
};
</script>
```

### 3. 样式引入

在 渲染层 main.js 文件中引入必要的样式：

```js
import "relax-life-kit/dist/relax-life-kit.css";
```

## 📚 API 文档

### RelaxDrawer 组件

#### Props

| 属性名                | 类型    | 默认值                                         | 说明              |
| --------------------- | ------- | ---------------------------------------------- | ----------------- |
| open                  | Boolean | false                                          | 控制抽屉显示/隐藏 |
| getRedirectUrlLoading | Boolean | false                                          | 加载状态          |
| title                 | String  | "😎 放松一下,劳逸结合"                         | 抽屉标题          |
| videoApiUrl           | String  | "https://api.yujn.cn/api/zzxjj.php?type=video" | 视频 API 地址     |
| tooltipConfig         | Object  |                                                | tooltip 配置      |
| tooltipConfig[isShow] | Boolean | true                                           | 是否显示          |

#### Events

| 事件名                       | 参数    | 说明         |
| ---------------------------- | ------- | ------------ |
| update:open                  | Boolean | 抽屉状态变化 |
| update:getRedirectUrlLoading | Boolean | 加载状态变化 |

### RelaxButton 组件

#### Props

| 属性名   | 类型            | 默认值     | 说明          |
| -------- | --------------- | ---------- | ------------- |
| loading  | Boolean         | false      | 加载状态      |
| icon     | String          | '🧘‍♀️'       | 按钮图标/文本 |
| title    | String          | '放松一下' | 按钮提示文本  |
| fontSize | [String Number] | icon 大小  |

#### Events

| 事件名 | 参数 | 说明         |
| ------ | ---- | ------------ |
| click  | -    | 按钮点击事件 |

### useRelax 组合式函数

#### 返回值

| 属性名                | 类型         | 说明         |
| --------------------- | ------------ | ------------ |
| relaxOpen             | Ref<Boolean> | 抽屉显示状态 |
| getRedirectUrlLoading | Ref<Boolean> | 加载状态     |
| openRelax             | Function     | 打开放松功能 |
| closeRelax            | Function     | 关闭放松功能 |
| setLoading            | Function     | 设置加载状态 |

### registerRelaxIpc 主进程函数

#### 参数

| 参数名             | 类型   | 默认值     | 说明           |
| ------------------ | ------ | ---------- | -------------- |
| options            | Object | {}         | 配置选项       |
| options.filePrefix | String | '放松一下' | 保存文件的前缀 |

## 🎨 自定义配置

### 更换视频源

```vue
<relax-drawer video-api-url="你的视频API地址" />
```

### 自定义文件保存前缀

```javascript
registerRelaxIpc({
  filePrefix: "我的视频",
});
```

### 自定义按钮样式

```vue
<relax-button icon="🎬" title="观看视频" />
```

## 🔧 高级用法

### 手动控制状态

```vue
<script setup>
import { useRelax } from "relax-life-kit";

const { relaxOpen, getRedirectUrlLoading, openRelax, closeRelax, setLoading } =
  useRelax();

// 手动打开
const handleOpen = () => {
  openRelax();
};

// 手动关闭
const handleClose = () => {
  closeRelax();
};

// 手动设置加载状态
const handleLoading = (loading) => {
  setLoading(loading);
};
</script>
```

### 使用水墨涟漪效果

```vue
<script setup>
import { createInkRipple } from "relax-life-kit";

const handleClick = async () => {
  await createInkRipple();
  // 其他操作...
};
</script>
```

## 📁 文件结构

```
relax-life-kit/
├── src/
│   ├── main/
│   │   └── relaxManager.js      # 主进程IPC处理
│   └── renderer/
│       ├── components/
│       │   ├── RelaxDrawer.vue  # 主要抽屉组件
│       │   └── RelaxButton.vue  # 触发按钮组件
│       ├── composables/
│       │   └── useRelax.js      # 状态管理
│       ├── utils/
│       │   └── inkRipple.js     # 水墨涟漪工具
│       └── styles/
│           └── inkRipple.scss   # 水墨涟漪样式
├── index.js                     # 主入口文件
├── package.json                 # 包配置
└── README.md                    # 使用说明
```

## ⚠️ 注意事项

1. **依赖要求**：确保项目中已安装 Vue 3、Ant Design Vue 和相关图标包
2. **网络连接**：需要网络连接来获取随机视频
3. **文件权限**：视频保存功能需要用户选择保存目录
4. **样式依赖**：需要引入相应的 CSS 动画样式
5. **Electron 版本**：建议使用 Electron 20+ 版本

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## ✨ 许可证

MIT License

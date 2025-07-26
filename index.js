// 主进程模块
export { registerRelaxIpc } from './src/main/relaxManager.js';

// 渲染进程组件
export { default as RelaxDrawer } from './src/renderer/components/RelaxDrawer.vue';
export { default as RelaxButton } from './src/renderer/components/RelaxButton.vue';

// 组合式函数
export { useRelax } from './src/renderer/composables/useRelax.js';

// 工具函数
export { createInkRipple } from './src/renderer/utils/inkRipple.js'; 
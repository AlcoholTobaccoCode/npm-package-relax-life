// 兼容性检查工具
let antdAvailable = false;
let antdComponents = {};

// 检查 Ant Design Vue 是否可用
export const checkAntdAvailability = () => {
  if (antdAvailable) return true;
  
  try {
    // 尝试导入 Ant Design Vue
    const antd = require('ant-design-vue');
    if (antd) {
      antdAvailable = true;
      antdComponents = antd;
      return true;
    }
  } catch (e) {
    // 如果 require 失败，尝试从全局获取
    if (typeof window !== 'undefined' && window.antd) {
      antdAvailable = true;
      antdComponents = window.antd;
      return true;
    }
  }
  
  return false;
};

// 获取 Ant Design Vue 组件
export const getAntdComponent = (componentName) => {
  if (!checkAntdAvailability()) {
    return null;
  }
  
  return antdComponents[componentName] || null;
};

// 创建降级组件
export const createFallbackComponent = (componentName, defaultProps = {}) => {
  return {
    name: `Fallback${componentName}`,
    props: Object.keys(defaultProps),
    setup(props, { slots, emit }) {
      return () => {
        const component = getAntdComponent(componentName);
        if (component) {
          return h(component, props, slots);
        }
        
        // 降级为原生 HTML 元素
        return createFallbackElement(componentName, props, slots, emit);
      };
    }
  };
};

// 创建降级 HTML 元素
const createFallbackElement = (componentName, props, slots, emit) => {
  const elementMap = {
    'Button': 'button',
    'Tooltip': 'div',
    'Drawer': 'div',
    'Modal': 'div',
    'Image': 'img',
    'Divider': 'hr'
  };
  
  const tag = elementMap[componentName] || 'div';
  const elementProps = {};
  
  // 根据组件类型设置不同的降级样式
  switch (componentName) {
    case 'Button':
      elementProps.class = 'fallback-button';
      elementProps.onClick = (e) => emit('click', e);
      break;
    case 'Tooltip':
      elementProps.class = 'fallback-tooltip';
      elementProps.title = props.title;
      break;
    case 'Drawer':
      elementProps.class = `fallback-drawer ${props.open ? 'open' : ''}`;
      break;
    case 'Modal':
      elementProps.class = `fallback-modal ${props.open ? 'open' : ''}`;
      break;
    case 'Image':
      elementProps.src = props.src;
      elementProps.alt = props.alt;
      elementProps.class = 'fallback-image';
      break;
    case 'Divider':
      elementProps.class = 'fallback-divider';
      break;
  }
  
  return h(tag, elementProps, slots);
};

// 从 Vue 导入必要的函数
import { h } from 'vue';

// 导出降级样式
export const fallbackStyles = `
.fallback-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 15px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5715;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  color: rgba(0, 0, 0, 0.85);
}

.fallback-button:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.fallback-button:active {
  border-color: #096dd9;
  color: #096dd9;
}

.fallback-button.primary {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.fallback-button.primary:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

.fallback-drawer {
  position: fixed;
  top: 0;
  right: -600px;
  width: 600px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  transition: right 0.3s;
  z-index: 1000;
  overflow-y: auto;
}

.fallback-drawer.open {
  right: 0;
}

.fallback-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.fallback-modal.open {
  opacity: 1;
  visibility: visible;
}

.fallback-modal .modal-content {
  background: #fff;
  border-radius: 6px;
  padding: 24px;
  max-width: 520px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.fallback-tooltip {
  position: relative;
  display: inline-block;
}

.fallback-tooltip:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}

.fallback-image {
  max-width: 100%;
  height: auto;
}

.fallback-divider {
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 16px 0;
}

/* 暗色主题适配 */
.dark-theme .fallback-button {
  background: #1f1f1f;
  border-color: #434343;
  color: #fff;
}

.dark-theme .fallback-button:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.dark-theme .fallback-drawer {
  background: #1f1f1f;
  color: #fff;
}

.dark-theme .fallback-modal .modal-content {
  background: #1f1f1f;
  color: #fff;
}

.dark-theme .fallback-divider {
  border-top-color: #434343;
}
`; 
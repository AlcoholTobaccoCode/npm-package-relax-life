/*
 * 水墨涟漪效果
 */
export const createInkRipple = () => {
  return new Promise((resolve) => {
    // 创建水墨涟漪元素
    const ripple = document.createElement('div');
    ripple.className = 'ink-ripple-global';
    document.body.appendChild(ripple);

    // 动画结束后移除元素
    ripple.addEventListener('animationend', () => {
      document.body.removeChild(ripple);
      resolve();
    });
  });
}; 
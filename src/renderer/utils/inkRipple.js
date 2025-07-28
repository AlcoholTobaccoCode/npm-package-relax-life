/*
 * 水墨涟漪效果
 */
export const createInkRipple = (crush = false) => {
  return new Promise((resolve) => {
    // 记录所有ripple元素，便于全部动画结束后统一resolve
    const ripples = [];
    let finished = 0;
    const total = crush ? 3 : 1;

    const handleAnimationEnd = (ripple) => {
      if (ripple && ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
      finished++;
      if (finished === total) {
        resolve();
      }
    };

    if (crush) {
      // 第一次立即创建，后续每次延迟100ms
      const createRipple = (i) => {
        const ripple = document.createElement('div');
        ripple.className = `ink-ripple-global ink-ripple-global-${i}`;
        document.body.appendChild(ripple);
        ripples.push(ripple);
        ripple.addEventListener('animationend', () => handleAnimationEnd(ripple), { once: true });
      };

      for (let i = 0; i < total; i++) {
        if (i === 0) {
          createRipple(i);
        } else {
          setTimeout(() => {
            createRipple(i);
          }, 100 * i);
        }
      }
    } else {
      const ripple = document.createElement('div');
      ripple.className = `ink-ripple-global ink-ripple-global-0`;
      document.body.appendChild(ripple);
      ripples.push(ripple);
      ripple.addEventListener('animationend', () => handleAnimationEnd(ripple), { once: true });
    }
  });
};
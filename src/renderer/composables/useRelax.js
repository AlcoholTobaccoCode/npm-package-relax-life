import { ref } from 'vue';

/**
 * 放松一下功能的状态管理
 */
export const useRelax = () => {
  // 状态
  const relaxOpen = ref(false);
  const getRedirectUrlLoading = ref(false);

  // 打开放松功能
  const openRelax = () => {
    relaxOpen.value = true;
  };

  // 关闭放松功能
  const closeRelax = () => {
    relaxOpen.value = false;
  };

  // 设置加载状态
  const setLoading = (loading) => {
    getRedirectUrlLoading.value = loading;
  };

  return {
    // 状态
    relaxOpen,
    getRedirectUrlLoading,
    
    // 方法
    openRelax,
    closeRelax,
    setLoading,
  };
}; 
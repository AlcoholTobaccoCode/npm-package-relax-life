<template>
  <div class="app">
    <div class="header">
      <h1>放松一下功能示例</h1>
      <p>这是一个完整的放松一下功能使用示例</p>
    </div>
    
    <div class="content">
      <div class="button-group">
        <h3>触发按钮</h3>
        <relax-button 
          :loading="getRedirectUrlLoading"
          @click="handleRelaxClick"
        />
      </div>
      
      <div class="info">
        <h3>功能说明</h3>
        <ul>
          <li>点击按钮打开放松抽屉</li>
          <li>自动播放随机视频</li>
          <li>支持视频下载保存</li>
          <li>包含水墨涟漪动画效果</li>
        </ul>
      </div>
    </div>
    
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
import { RelaxDrawer, RelaxButton, useRelax } from '../index.js';

// 使用组合式函数管理状态
const { relaxOpen, getRedirectUrlLoading, openRelax } = useRelax();

// 处理点击事件
const handleRelaxClick = () => {
  openRelax();
};
</script>

<style lang="scss" scoped>
.app {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    color: #1890ff;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    font-size: 16px;
  }
}

.content {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.button-group {
  flex: 1;
  text-align: center;
  
  h3 {
    margin-bottom: 20px;
    color: #333;
  }
}

.info {
  flex: 2;
  
  h3 {
    margin-bottom: 15px;
    color: #333;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      padding: 8px 0;
      color: #666;
      position: relative;
      padding-left: 20px;
      
      &::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #52c41a;
        font-weight: bold;
      }
    }
  }
}

// 暗色主题适配
.dark-theme {
  .app {
    background: #141414;
    color: #fff;
  }
  
  .header h1 {
    color: #40a9ff;
  }
  
  .header p,
  .info li {
    color: #ccc;
  }
  
  .button-group h3,
  .info h3 {
    color: #fff;
  }
}
</style> 
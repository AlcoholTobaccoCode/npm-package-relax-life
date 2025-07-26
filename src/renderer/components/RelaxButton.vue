<template>
  <div 
    class="relax-button" 
    @click="handleRelax"
    :title="title"
    :class="{ loading: loading }"
  >
    <loading-outlined v-if="loading" />
    <span v-else>{{ icon }}</span>
  </div>
</template>

<script setup>
import { LoadingOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '🧘‍♀️',
  },
  title: {
    type: String,
    default: '放松一下',
  },
});

const emit = defineEmits(['click']);

const handleRelax = () => {
  if (props.loading) {
    return;
  }
  emit('click');
};
</script>

<style lang="scss" scoped>
.relax-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 18px;
  
  &:hover {
    background-color: rgba(24, 144, 255, 0.1);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &.loading {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

// 暗色主题适配
.dark-theme .relax-button {
  &:hover {
    background-color: rgba(64, 169, 255, 0.2);
  }
}
</style> 
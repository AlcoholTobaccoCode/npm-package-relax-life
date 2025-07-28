<template>

  <a-tooltip>
    <template #title v-if="tooltipConfig.isShow">{{ title }}</template>
    <div 
      class="relax-life-kit_relax-button" 
      @click="handleRelax"
      :title="title"
      :class="{ loading: loading }"
      :style="{
        fontSize: calcFontSize
      }"
    >
      <loading-outlined v-if="loading" />
      <span v-else>{{ icon }}</span>
    </div>
  </a-tooltip>

</template>

<script setup>
import { LoadingOutlined } from '@ant-design/icons-vue';
import { computed } from 'vue';

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
  fontSize: {
    type: Number,
    default: () => 16
  },
  tooltipConfig: {
    type: Object,
    default: () => ({
      isShow: true
    })
  }
});

const emit = defineEmits(['click']);

const calcFontSize = computed(() => {
  if (typeof props.fontSize === 'number') {
    return `${props.fontSize}px`;
  } else if (
    typeof props.fontSize === 'string' &&
    (props.fontSize.includes('px') ||
     props.fontSize.includes('em') ||
     props.fontSize.includes('rem') ||
     props.fontSize.includes('%'))
  ) {
    return props.fontSize;
  } else {
    return '16px';
  }

});

const handleRelax = () => {
  if (props.loading) {
    return;
  }
  emit('click');
};
</script>

<style lang="scss">
.relax-life-kit_relax-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  min-width: fit-content;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 18px;
  cursor: pointer;
  padding: 0 8px;
  
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
.dark-theme .relax-life-kit_relax-button {
  &:hover {
    background-color: rgba(64, 169, 255, 0.2);
  }
}
</style> 
<template>
  <div>
    <!-- 放松一下抽屉 -->
    <a-drawer
      :width="600"
      title=""
      placement="right"
      :open="relaxOpenComputed"
      :closable="false"
      :destroyOnClose="true"
      @close="handleRelaxClose"
    >
      <div class="relax-video-container">
        <div class="relax-video-title" @click="handleHistory">
          <span>{{ title }}</span>
          <a-tooltip title="历史记录">
            <history-outlined />
          </a-tooltip>
        </div>
        <a-divider />
        <div class="relax-video">
          <div class="relax-video-content">
            <video
              ref="relaxVideoRef"
              :src="relaxVideoUrl"
              autoplay
              muted
              loop
              controls
              style="width: 100%; height: 90%"
            ></video>
          </div>
          <div class="relax-video-btns">
            <a-button type="primary" @click="handleRelaxChange">换一个</a-button>
            <a-button
              type="primary"
              :loading="getRedirectUrlLoadingComputed"
              @click="handleRelaxSave"
            >保存</a-button>
            <a-button @click="handleRelaxClose">关闭</a-button>
          </div>
        </div>
      </div>
    </a-drawer>

    <!-- 历史记录弹窗 -->
    <a-modal
      v-model:open="relaxHistoryOpen"
      title="往昔如镜 照影不照形"
      okText="好的✨"
      cancelText="再见👋"
      @ok="relaxHistoryOpen = false"
      @cancel="relaxHistoryOpen = false"
    >
      <p>镜中影可暂观却不可触摸，执着于追溯形骸不如把握当下神韵</p>
      <p>来路无可眷恋，期待唯有远方</p>
      <p>你的人生中会有人</p>
      <p>想要阻止你拖累你</p>
      <p>但别让他们得逞</p>
      <p>不要停止奔跑 不要回顾来路</p>
      <p>值得期待的只有远方</p>
      <p>👋✨✨✨</p>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { message } from "ant-design-vue";
import { HistoryOutlined } from "@ant-design/icons-vue";

// Props
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  getRedirectUrlLoading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "😎 放松一下,劳逸结合",
  },
  videoApiUrl: {
    type: String,
    default: "https://api.yujn.cn/api/zzxjj.php?type=video",
  },
});

// Emits
const emit = defineEmits(["update:open", "update:getRedirectUrlLoading"]);

// 响应式数据
const relaxVideoUrl = ref("");
const relaxVideoRef = ref(null);
const relaxHistoryOpen = ref(false);

// 计算属性
const relaxOpenComputed = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const getRedirectUrlLoadingComputed = computed({
  get: () => props.getRedirectUrlLoading,
  set: (value) => emit("update:getRedirectUrlLoading", value),
});

// 获取重定向URL
const getRedirectUrl = async () => {
  try {
    const response = await fetch(props.videoApiUrl, { method: "GET" });
    return response.url;
  } catch (err) {
    console.error("fetch error:", err);
    return "";
  }
};

// 打开放松功能
const handleOpenRelax = async () => {
  getRedirectUrlLoadingComputed.value = true;
  relaxVideoUrl.value = await getRedirectUrl();
  getRedirectUrlLoadingComputed.value = false;
  relaxOpenComputed.value = true;
};

// 关闭放松功能
const handleRelaxClose = () => {
  relaxOpenComputed.value = false;
};

// 换一个视频
const handleRelaxChange = async () => {
  getRedirectUrlLoadingComputed.value = true;
  relaxVideoUrl.value = await getRedirectUrl();
  getRedirectUrlLoadingComputed.value = false;
};

// 保存视频
const handleRelaxSave = async () => {
  const videoEl = relaxVideoRef.value;
  if (!videoEl) return;
  const realUrl = videoEl.currentSrc;
  try {
    getRedirectUrlLoadingComputed.value = true;
    const response = await fetch(realUrl);
    if (!response.ok) throw new Error("下载失败");
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    // 发送 buffer 给主进程保存
    const result = await window.electron.ipcRenderer.invoke("save-video-buffer", {
      buffer: Array.from(new Uint8Array(arrayBuffer)),
    });
    if (result.success) {
      message.success("下载成功！");
    } else {
      message.error(result.error);
    }
  } catch (e) {
    message.error(e.message);
  } finally {
    getRedirectUrlLoadingComputed.value = false;
  }
};

// 历史记录
const handleHistory = async () => {
  // 触发水墨涟漪效果（如果存在）
  if (typeof window.createInkRipple === 'function') {
    await window.createInkRipple();
  }
  // 等动画结束后再打开 modal
  relaxHistoryOpen.value = true;
};

// 暴露方法给父组件
defineExpose({
  handleOpenRelax,
});
</script>

<style lang="scss" scoped>
.relax-video-container {
  display: flex;
  flex-direction: column;
  height: 90%;
}

// 放松一下视频样式
.relax-video-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding: 0 16px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }
}

.relax-video {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .relax-video-content {
    width: 100%;
    height: 90%;

    video {
      width: 100%;
      height: 100%;
    }
  }

  .relax-video-btns {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
}

// 暗色主题适配
.dark-theme {
  .relax-video-title {
    color: #fff;
    
    &:hover {
      color: #40a9ff;
    }
  }
}
</style> 
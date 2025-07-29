<template>
  <div>
    <!-- 放松一下抽屉 -->
    <div class="relax-drawer-wrapper">
      <div
        class="relax-drawer-overlay"
        v-if="relaxOpenComputed"
        @click="handleRelaxClose"
      ></div>
      <div class="relax-drawer-content" :class="{ open: relaxOpenComputed }">
        <div class="relax-video-container">
          <div class="relax-video-title" @click="handleHistory">
            <span class="title-text" :title="'如果遇到加载不出可以换一个'">{{
              title
            }}</span>
            <span class="history-icon" title="历史记录">📜</span>
          </div>
          <hr class="relax-divider" />

          <div class="relax-video">
            <div class="relax-video-content">
              <template v-if="isImageFile(relaxVideoUrl)">
                <div class="img">
                  <img
                    :src="relaxVideoUrl"
                    alt="放松一下"
                    @error="handleImageError"
                  />
                </div>
              </template>
              <template v-else>
              <!-- <template v-if="isVideoFile(relaxVideoUrl)"> -->
                <video
                  ref="relaxVideoRef"
                  :src="relaxVideoUrl"
                  autoplay
                  muted
                  loop
                  controls
                ></video>
              </template>
              <!-- <template v-else>
                <div style="text-align: center; color: #aaa">
                  暂不支持的媒体类型
                </div>
              </template> -->
            </div>
            <div class="relax-video-btns">
              <button class="relax-btn primary" @click="handleRelaxChange">
                换一个
              </button>
              <button
                class="relax-btn primary"
                :class="{ loading: getRedirectUrlLoadingComputed }"
                @click="handleRelaxSave"
              >
                保存
              </button>
              <button class="relax-btn" @click="handleRelaxClose">关闭</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 历史记录弹窗 -->
      <div
        class="relax-modal-overlay"
        v-if="relaxHistoryOpen"
        @click="relaxHistoryOpen = false"
      >
        <div class="relax-modal-content" @click.stop>
          <div class="modal-header">
            <h3>往昔如镜 照影不照形</h3>
          </div>
          <div class="modal-body">
            <p>镜中影可暂观却不可触摸，执着于追溯形骸不如把握当下神韵</p>
            <p>来路无可眷恋，期待唯有远方</p>
            <p>你的人生中会有人</p>
            <p>想要阻止你拖累你</p>
            <p>但别让他们得逞</p>
            <p>不要停止奔跑 不要回顾来路</p>
            <p>值得期待的只有远方</p>
            <p>👋✨✨✨</p>
          </div>
          <div class="modal-footer">
            <button class="relax-btn" @click="relaxHistoryOpen = false">
              再见👋
            </button>
            <button class="relax-btn primary" @click="relaxHistoryOpen = false">
              好的✨
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, h } from "vue";
import { createInkRipple } from "../utils/inkRipple";
import { imgError } from "../utils/index";

// 同步导入 + 降级 fallback
let message;
try {
  message = require("ant-design-vue").message;
} catch (e) {
  message = {
    success: (msg) => console.log("Success:", msg),
    error: (msg) => console.error("Error:", msg),
  };
}

let HistoryOutlined;
try {
  HistoryOutlined = require("@ant-design/icons-vue").HistoryOutlined;
} catch (e) {
  HistoryOutlined = {
    name: "FallbackHistory",
    setup() {
      return () => h("span", { class: "fallback-history-icon" }, "📜");
    },
  };
}

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

const emit = defineEmits(["update:open", "update:getRedirectUrlLoading"]);

const fileType = {
  video: [
    "mp4",
    "avi",
    "mov",
    "wmv",
    "flv",
    "webm",
    "mkv",
    "m4v",
    "3gp",
    "ogv",
    "video"
  ],
  imgs: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "bmp",
    "svg",
    "ico"
  ],
};

// 判断是否为 Electron 环境
const isElectron = ref(!!(
  window &&
  window.electron &&
  window.electron.ipcRenderer
));

const relaxVideoUrl = ref("");
const relaxVideoRef = ref(null);
const relaxHistoryOpen = ref(false);
const relaxHistoryOpenLoading = ref(false);

// 判断是否为视频文件
const isVideoFile = (url) => {
  if (!url) return false;
  // 移除查询参数
  const urlWithoutQuery = url.split("?")[0];
  // 检查URL中是否包含视频扩展名
  return fileType.video.some((ext) =>
    urlWithoutQuery.toLowerCase().includes(`.${ext}`)
  );
};

// 判断是否为图片文件
const isImageFile = (url) => {
  if (!url) return false;
  // 移除查询参数
  const urlWithoutQuery = url.split("?")[0];
  // 检查URL中是否包含图片扩展名
  return fileType.imgs.some((ext) =>
    urlWithoutQuery.toLowerCase().includes(`.${ext}`)
  );
};

const relaxOpenComputed = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const getRedirectUrlLoadingComputed = computed({
  get: () => props.getRedirectUrlLoading,
  set: (value) => emit("update:getRedirectUrlLoading", value),
});

// 处理图片加载错误
const handleImageError = (e) => {
  e.target.src = imgError;
};

// 获取重定向URL
const getRedirectUrl = async () => {
  try {
    if (isElectron.value) {
      const response = await fetch(props.videoApiUrl, { method: "GET" });
      return response.url;
    } else {
      return props.videoApiUrl;
    }
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

// 保存视频/图片，兼容 Electron、Web、图片
const handleRelaxSave = async () => {
  let realUrl = "";
  let fileName = "";
  let isVideo = isVideoFile(relaxVideoUrl.value);
  let isImg = isImageFile(relaxVideoUrl.value);

  // 获取文件名
  const getFileNameFromUrl = (url, defaultExt) => {
    try {
      const urlObj = new URL(url, window.location.origin);
      let pathname = urlObj.pathname;
      let name = pathname.substring(pathname.lastIndexOf("/") + 1);
      if (!name || !/\.[a-zA-Z0-9]+$/.test(name)) {
        // 没有扩展名
        name = `relax_${Date.now()}.${defaultExt}`;
      }
      return decodeURIComponent(name);
    } catch {
      return `relax_${Date.now()}.${defaultExt}`;
    }
  };

  try {
    getRedirectUrlLoadingComputed.value = true;

    // 视频
    if (isVideo) {
      const videoEl = relaxVideoRef.value;
      if (!videoEl) {
        message.error("未找到视频元素");
        return;
      }
      realUrl = videoEl.currentSrc;
      fileName = getFileNameFromUrl(realUrl, "mp4");
    }
    // 图片
    else if (isImg) {
      realUrl = relaxVideoUrl.value;
      fileName = getFileNameFromUrl(realUrl, "jpg");
    } else {
      message.error("暂不支持的媒体类型");
      return;
    }

    if (isElectron.value) {
      // Electron 走原有逻辑
      const response = await fetch(realUrl);
      if (!response.ok) throw new Error("下载失败");
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      // 发送 buffer 给主进程保存
      const result = await window.electron.ipcRenderer.invoke(
        "save-video-buffer",
        {
          buffer: Array.from(new Uint8Array(arrayBuffer)),
          fileName, // 兼容主进程可选参数
        }
      );
      if (result.success) {
        message.success("下载成功！");
      } else {
        message.error(result.error);
      }
    } else {
      // Web 端保存
      const response = await fetch(realUrl, { mode: "cors" });
      if (!response.ok) throw new Error("下载失败");
      const blob = await response.blob();
      // 创建 a 标签下载
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      message.success("下载成功！");
    }
  } catch (e) {
    message.error(e.message || "保存失败");
  } finally {
    getRedirectUrlLoadingComputed.value = false;
  }
};

// 历史记录
const handleHistory = async () => {
  if (relaxHistoryOpenLoading.value) return;
  // 触发水墨涟漪效果
  if (typeof createInkRipple === "function") {
    relaxHistoryOpenLoading.value = true;
    const isCrush = Math.random() > 0.3;
    await createInkRipple(isCrush);
    relaxHistoryOpenLoading.value = false;
  }

  // 等动画结束后再打开 modal
  relaxHistoryOpen.value = true;
};

watch(
  () => relaxOpenComputed.value,
  async (newVal) => {
    if (newVal) {
      relaxVideoUrl.value = await getRedirectUrl();
    }
  }
);

// 暴露方法给父组件
defineExpose({
  handleOpenRelax,
});
</script>

<style lang="scss" scoped>
.relax-drawer-wrapper {
  position: relative;
}

.relax-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
}

.relax-drawer-content {
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

  &.open {
    right: 0;
  }
}

.relax-video-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

// 放松一下视频样式
.relax-video-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding: 16px;
  cursor: pointer;
  transition: color 0.3s;

  .title-text {
    flex: 1;

    &:hover {
      color: #1890ff;
    }
  }

  .history-icon {
    font-size: 18px;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.relax-divider {
  border: none;
  border-top: 1px solid #f0f0f0;
  margin: 0 16px;
}

.relax-video {
  width: 100%;
  height: calc(100% - 70px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px 16px;
  box-sizing: border-box;

  .relax-video-content {
    width: 100%;
    height: 90%;
    flex: 1;

    .img,
    video {
      width: 100%;
      height: 100%;
    }

    .img {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }
  }

  .relax-video-btns {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
}

.relax-btn {
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

  &:hover {
    border-color: #40a9ff;
    color: #40a9ff;
  }

  &:active {
    border-color: #096dd9;
    color: #096dd9;
  }

  &.primary {
    background: #1890ff;
    border-color: #1890ff;
    color: #fff;

    &:hover {
      background: #40a9ff;
      border-color: #40a9ff;
    }
  }

  &.loading {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.relax-modal-overlay {
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
}

.relax-modal-content {
  background: #fff;
  border-radius: 6px;
  max-width: 520px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;

  .modal-header {
    padding: 16px 24px 0;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .modal-body {
    padding: 16px 24px;

    p {
      margin: 8px 0;
      line-height: 1.6;
    }
  }

  .modal-footer {
    padding: 0 24px 16px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

// 暗色主题适配
.dark-theme {
  .relax-drawer-content {
    background: #1f1f1f;
    color: #fff;
  }

  .relax-video-title {
    color: #fff;

    .title-text:hover {
      color: #40a9ff;
    }
  }

  .relax-divider {
    border-top-color: #434343;
  }

  .relax-btn {
    background: #1f1f1f;
    border-color: #434343;
    color: #fff;

    &:hover {
      border-color: #40a9ff;
      color: #40a9ff;
    }
  }

  .relax-modal-content {
    background: #1f1f1f;
    color: #fff;
  }
}
</style>

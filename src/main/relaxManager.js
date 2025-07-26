import { ipcMain, dialog } from 'electron';
import { join } from 'node:path';
import fs from 'fs';

/**
 * 注册放松一下相关的IPC处理程序
 * @param {Object} options - 配置选项
 * @param {string} options.filePrefix - 文件前缀，默认为 '放松一下'
 */
export const registerRelaxIpc = (options = {}) => {
  const { filePrefix = '放松一下' } = options;
  
  // 放松一下视频保存
  ipcMain.handle('save-video-buffer', async (event, { buffer }) => {
    let result = await dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory", "promptToCreate"],
    });
    if (!result.canceled) {
      let directoryPath = result.filePaths[0];
      const destPath = join(directoryPath, `${filePrefix}-${Date.now()}.mp4`);
      try {
        await fs.promises.writeFile(destPath, Buffer.from(buffer));
        return { success: true, path: destPath };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: '用户取消' };
  });
}; 
import nodemailer from 'nodemailer';
import { config, ENV } from '../config/index';

/**
 * 通知服务
 * 负责发送邮件通知（未来可扩展为飞书通知）
 * TODO: 目前不会配置邮件通知，后续应该会调整为 feishu 通知，修改 robot 服务来配合消息推送
 */
export class NotificationService {
  private transporter?: nodemailer.Transporter;

  constructor() {
    if (config.email) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: config.email.auth
      });
    }
  }

  /**
   * 发送邮件通知
   * @param subject 邮件主题
   * @param content 邮件内容
   * @param isError 是否为错误通知
   */
  async sendEmailNotification(
    subject: string,
    content: string,
    isError = false
  ): Promise<void> {
    if (!this.transporter || !config.email) {
      console.log('邮件通知未配置，跳过发送');
      return;
    }

    try {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: ${
      isError ? '#f44336' : '#4caf50'
    }; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f5f5f5; }
    .footer { padding: 10px; text-align: center; color: #666; font-size: 12px; }
    pre { background-color: #fff; padding: 10px; border-left: 3px solid ${
      isError ? '#f44336' : '#4caf50'
    }; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${isError ? '❌' : '✅'} ${subject}</h1>
  </div>
  <div class="content">
    <pre>${content}</pre>
  </div>
  <div class="footer">
    <p>DMS-UI 自动部署系统 | 环境: ${ENV}</p>
    <p>${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
  </div>
</body>
</html>
      `;

      await this.transporter.sendMail({
        from: config.email.from,
        to: config.email.to,
        subject: `[DMS-UI] ${subject}`,
        html
      });

      console.log('邮件通知发送成功');
    } catch (error: any) {
      console.error('邮件通知发送失败:', error.message);
      // 不抛出错误，避免影响主流程
    }
  }
}

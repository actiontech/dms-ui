import { compressToBase64, decompressFromBase64 } from 'lz-string';

export interface ICrossAppMessage {
  id: string;
  type: string;
  source: 'base' | 'cloud-beaver';
  target?: 'base' | 'cloud-beaver' | 'all';
  data: any;
  timestamp: number;
}

export interface ICrossAppCommunicationOptions {
  appName: 'base' | 'cloud-beaver';
  storageKey?: string;
  enableCompression?: boolean;
}

export class CrossAppCommunication {
  private appName: 'base' | 'cloud-beaver';
  private storageKey: string;
  private enableCompression: boolean;
  private listeners: Map<string, ((message: ICrossAppMessage) => void)[]> =
    new Map();
  private storageListener: ((event: StorageEvent) => void) | null = null;

  constructor(options: ICrossAppCommunicationOptions) {
    this.appName = options.appName;
    this.storageKey = options.storageKey || 'DMS_CB_CHANNEL';
    this.enableCompression = options.enableCompression ?? true;
    this.initStorageListener();
  }

  /**
   * 发送消息到另一个应用
   */
  public sendMessage(
    type: string,
    data: any,
    target?: 'base' | 'cloud-beaver' | 'all'
  ): void {
    const message: ICrossAppMessage = {
      id: this.generateId(),
      type,
      source: this.appName,
      target: target || 'all',
      data,
      timestamp: Date.now()
    };

    this.writeToStorage(message);
  }

  /**
   * 监听特定类型的消息
   */
  public onMessage(
    type: string,
    callback: (message: ICrossAppMessage) => void
  ): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }

    this.listeners.get(type)!.push(callback);

    // 返回取消监听的函数
    return () => {
      const callbacks = this.listeners.get(type);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * 获取当前存储的所有消息
   */
  public getStoredMessages(): ICrossAppMessage[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];

      const decompressed = this.enableCompression
        ? this.decompressData(stored)
        : stored;

      return JSON.parse(decompressed) || [];
    } catch {
      return [];
    }
  }

  /**
   * 清理过期消息（超过5分钟的消息）
   */
  public cleanExpiredMessages(): void {
    const messages = this.getStoredMessages();
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    const validMessages = messages.filter(
      (msg) => msg.timestamp > fiveMinutesAgo
    );
    this.saveMessages(validMessages);
  }

  /**
   * 销毁通信实例
   */
  public destroy(): void {
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
    }
    this.listeners.clear();
  }

  private initStorageListener(): void {
    this.storageListener = (event: StorageEvent) => {
      if (event.key === this.storageKey && event.newValue) {
        this.handleStorageChange(event.newValue);
      }
    };

    window.addEventListener('storage', this.storageListener);
  }

  private handleStorageChange(newValue: string): void {
    try {
      const decompressed = this.enableCompression
        ? this.decompressData(newValue)
        : newValue;

      const messages: ICrossAppMessage[] = JSON.parse(decompressed) || [];

      // 处理新消息
      messages.forEach((message) => {
        if (this.shouldProcessMessage(message)) {
          this.processMessage(message);
        }
      });
    } catch (error) {
      console.warn('Failed to parse cross-app message:', error);
    }
  }

  private shouldProcessMessage(message: ICrossAppMessage): boolean {
    // 不处理自己发送的消息
    if (message.source === this.appName) return false;

    // 检查目标
    if (
      message.target &&
      message.target !== 'all' &&
      message.target !== this.appName
    ) {
      return false;
    }

    return true;
  }

  private processMessage(message: ICrossAppMessage): void {
    const callbacks = this.listeners.get(message.type);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in message callback:', error);
        }
      });
    }
  }

  private writeToStorage(message: ICrossAppMessage): void {
    const messages = this.getStoredMessages();
    messages.push(message);
    this.saveMessages(messages);
  }

  private saveMessages(messages: ICrossAppMessage[]): void {
    const serialized = JSON.stringify(messages);
    const compressed = this.enableCompression
      ? this.compressData(serialized)
      : serialized;

    localStorage.setItem(this.storageKey, compressed);
  }

  private compressData(data: string): string {
    try {
      return compressToBase64(data);
    } catch {
      return data;
    }
  }

  private decompressData(compressed: string): string {
    try {
      return decompressFromBase64(compressed) || compressed;
    } catch {
      return compressed;
    }
  }

  private generateId(): string {
    return `${this.appName}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }
}

// 消息类型常量
export const MESSAGE_TYPES = {
  // 认证相关
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  TOKEN_REFRESH: 'TOKEN_REFRESH',

  // 主题和语言
  THEME_CHANGE: 'THEME_CHANGE',
  LANGUAGE_CHANGE: 'LANGUAGE_CHANGE',

  // 数据源相关
  DATASOURCE_CHANGE: 'DATASOURCE_CHANGE',
  DATASOURCE_CONNECTION_TEST: 'DATASOURCE_CONNECTION_TEST',

  // 工单相关
  WORKFLOW_CREATE: 'WORKFLOW_CREATE',
  WORKFLOW_STATUS_CHANGE: 'WORKFLOW_STATUS_CHANGE',

  // SQL执行相关
  SQL_EXECUTION_START: 'SQL_EXECUTION_START',
  SQL_EXECUTION_RESULT: 'SQL_EXECUTION_RESULT',
  SQL_EXECUTION_ERROR: 'SQL_EXECUTION_ERROR',

  // 系统配置
  SYSTEM_CONFIG_CHANGE: 'SYSTEM_CONFIG_CHANGE',

  // 通用
  NOTIFICATION: 'NOTIFICATION',
  NAVIGATION: 'NAVIGATION'
} as const;

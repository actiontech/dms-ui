# ActionTech DMS Kit

ActionTech DMS Kit

## 安装

```bash
pnpm add @actiontech/dms-kit
```

## 使用方法

### 基础配置

在使用 API 服务之前，您需要配置 HTTP 客户端：

```typescript
import axios from 'axios';
import { ApiClient } from '@actiontech/dms-kit';

// 创建并配置您的 axios 实例
const apiClient = axios.create({
  baseURL: 'https://your-api-endpoint.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 基础配置
ApiClient.configure(apiClient);
```

### 高级配置

SDK 提供了丰富的配置选项来满足您的自定义需求：

```typescript
import axios from 'axios';
import { 
  type ApiClientConfigOptions 
} from '@actiontech/dms-kit';

const apiClient = axios.create({
  baseURL: 'https://your-api-endpoint.com',
  timeout: 10000,
});

// 高级配置选项
const configOptions: ApiClientConfigOptions = {
  // 开启调试模式
  debug: true,
  
  // 自定义错误处理
  onError: (error) => {
    console.error('API Error:', error);
    // 可以在这里集成错误报告服务
  },
  
  // 自定义请求拦截器
  requestInterceptor: (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  
  // 自定义响应拦截器  
  responseInterceptor: (response) => {
    // 可以在这里处理通用的响应逻辑
    if (response.data?.code !== 0) {
      console.warn('API Warning:', response.data?.message);
    }
    return response;
  },
};

// 配置 API 客户端
ApiClient.configure(apiClient, configOptions);
```

### API 客户端管理

SDK 提供了灵活的客户端管理功能：

```typescript
import { ApiClient } from '@actiontech/dms-kit';

// 检查是否已配置
if (!ApiClient.isConfigured()) {
  console.log('API client not configured yet');
}

// 运行时更新配置选项
ApiClient.updateOptions({
  debug: false,
  onError: (error) => {
    // 新的错误处理逻辑
  }
});

// 重置配置
ApiClient.reset();

// 直接设置客户端实例（高级用法）
ApiClient.setClient(myCustomAxiosInstance);
```

### 使用 API 服务

```typescript
import { SQLEApi, DMSApi } from '@actiontech/dms-kit';

// 使用 SQLE API
try {
  const users = await DMSApi.UserService.ListUsers();
  console.log('Users:', users.data);
} catch (error) {
  console.error('Failed to fetch users:', error);
}

// 使用 DMS API
try {
  const dashboard = await   SQLEApi.DashboardService.getDashboardV1();
  console.log('dashboard:', dashboard.data);
} catch (error) {
  console.error('Failed to fetch dashboard:', error);
}
```

### 使用主题配置

```typescript
import { 
  darkThemeUI, 
  darkThemeBasic, 
  lightThemeUI, 
  lightThemeBasic 
} from '@actiontech/dms-kit';

// 使用深色主题
const darkTheme = {
  ...darkThemeUI,
  ...darkThemeBasic
};

// 使用浅色主题
const lightTheme = {
  ...lightThemeUI,
  ...lightThemeBasic
};

// 在 Ant Design 中使用
import { ConfigProvider } from 'antd';

<ConfigProvider theme={{
  token: darkTheme.uiToken,
  // 其他主题配置
}}>
  {/* 您的应用组件 */}
</ConfigProvider>
```

### 使用数据常量

SDK 提供了常用的数据常量和配置：

```typescript
import { 
  ModalFormLayout,
  PageFormLayout,
  PROJECT_ROUTER_PARAM,
  ComponentControlHeight,
  SQLE_BASE_URL,
  DMS_DEFAULT_WEB_TITLE,
  EmitterKey
} from '@actiontech/dms-kit';

// 使用表单布局常量
<Form {...ModalFormLayout}>
  {/* 模态框表单 */}
</Form>

<Form {...PageFormLayout}>
  {/* 页面表单 */}
</Form>

// 使用路由参数
const projectUrl = `/project/${PROJECT_ROUTER_PARAM}/detail`;

// 使用事件键常量
eventEmitter.emit(EmitterKey.UPDATE_LOCAL_COLUMNS, data);

// 使用控件高度常量
const buttonHeight = ComponentControlHeight.default; // 36px
```

### 使用枚举定义

SDK 提供了完整的枚举定义：

```typescript
import { 
  PackageNameEnum,
  SupportLanguage,
  ResponseCode,
  SupportTheme,
  SystemRole,
  StorageKey,
  OpPermissionTypeUid
} from '@actiontech/dms-kit';

// 使用语言枚举
const currentLanguage = SupportLanguage.zhCN; // 'zh-CN'

// 使用主题枚举
const currentTheme = SupportTheme.DARK; // 'dark'

// 处理响应码
if (response.code === ResponseCode.SUCCESS) {
  // 请求成功
}

// 使用系统角色
const isAdmin = userRole === SystemRole.admin;

// 使用存储键
localStorage.setItem(StorageKey.Language, SupportLanguage.enUS);
const token = localStorage.getItem(StorageKey.Token);

// 使用权限类型 UID
const hasProjectAdminPermission = permissions.includes(OpPermissionTypeUid.project_admin);
```

## 类型定义

SDK 提供了完整的 TypeScript 类型定义：

```typescript
import type { 
  ApiClientConfigOptions 
} from '@actiontech/dms-kit';

// 配置选项类型
const options: ApiClientConfigOptions = {
  debug: true,
  onError: (error) => {},
  requestInterceptor: (config) => config,
  responseInterceptor: (response) => response,
};
```

## 错误处理

SDK 提供了多层次的错误处理：

```typescript
import { ApiClient } from '@actiontech/dms-kit';

// 全局错误处理
ApiClient.configure(apiClient, {
  onError: (error) => {
    if (error.response?.status === 401) {
      // 处理认证错误
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      // 处理服务器错误
      console.error('Server error:', error);
    }
  }
});

// 服务级别错误处理
try {
  const response = await sqleService.getUsers();
} catch (error) {
  // 处理特定 API 的错误
  console.error('Failed to get users:', error);
}
```

## 注意事项

1. **必须配置**: 在使用任何 API 服务之前，必须先调用 `configure()` 方法配置 HTTP 客户端
2. **推荐 axios**: 建议使用 axios 作为 HTTP 客户端，但也可以使用其他兼容的库(目前的类型定义只支持 axios 客户端)
3. **错误处理**: 确保正确处理认证、错误处理和请求拦截
4. **调试模式**: 在开发环境中启用 `debug: true` 来获得详细的日志信息
5. **类型安全**: 充分利用 TypeScript 类型定义来保证类型安全

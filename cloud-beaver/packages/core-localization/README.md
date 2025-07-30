# core-localization

一个为 CloudBeaver 设计的国际化（i18n）功能包，提供与 react-i18next 类似的 API，专门处理 `[key, value]` 数组格式的语言包数据。

## 特性

- 🌍 支持多语言切换
- 🔄 与 react-i18next 兼容的 API
- 📦 支持 `[key, value]` 数组格式的语言包
- 🎯 参数插值支持（`{param}` 和 `{{param}}` 格式）
- 💾 自动保存语言偏好到 localStorage
- ⚡ TypeScript 支持
- 🪝 提供多个便捷的 React hooks

## 安装

```bash
pnpm add @cloudbeaver/core-localization
```

## 基本使用

### 1. 准备语言包数据

```typescript
// locales/zh.ts
export default [
  ['hello', '你好'],
  ['welcome', '欢迎 {{name}}！'],
  ['goodbye', '再见'],
];

// locales/en.ts
export default [
  ['hello', 'Hello'],
  ['welcome', 'Welcome {{name}}!'],
  ['goodbye', 'Goodbye'],
];
```

### 2. 设置 Provider

```typescript
import React from 'react';
import { LocalizationProvider } from '@cloudbeaver/core-localization';
import zhLocale from './locales/zh';
import enLocale from './locales/en';

const resources = {
  zh: zhLocale,
  en: enLocale,
};

function App() {
  return (
    <LocalizationProvider resources={resources} defaultLanguage="zh">
      <YourApp />
    </LocalizationProvider>
  );
}
```

### 3. 在组件中使用翻译

```typescript
import React from 'react';
import { useTranslation } from '@cloudbeaver/core-localization';

function MyComponent() {
  const { t, changeLanguage, currentLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('hello')}</h1>
      <p>{t('welcome', { name: '张三' })}</p>
      
      <button onClick={() => changeLanguage('en')}>
        Switch to English
      </button>
      
      <p>当前语言: {currentLanguage}</p>
    </div>
  );
}
```

## API 参考

### LocalizationProvider

```typescript
interface LocalizationProviderProps {
  children: React.ReactNode;
  resources: LocaleResources;
  defaultLanguage?: SupportedLanguage;
}
```

### useTranslation

返回国际化相关的所有功能：

```typescript
const { t, translate, changeLanguage, currentLanguage } = useTranslation();
```

- `t(key, params?)` - 翻译函数（主要使用）
- `translate(key, params?)` - 翻译函数（t 的别名）
- `changeLanguage(language)` - 切换语言
- `currentLanguage` - 当前语言代码

### 其他 hooks

```typescript
// 只获取翻译函数
const t = useT();

// 只获取当前语言
const currentLanguage = useCurrentLanguage();

// 只获取语言切换函数
const changeLanguage = useChangeLanguage();
```

## 参数插值

支持两种参数插值格式：

```typescript
// 单大括号
t('welcome', { name: 'John' }); // "Welcome John!"

// 双大括号
t('welcome', { name: 'John' }); // "Welcome John!"
```

## 类型定义

```typescript
type SupportedLanguage = 'zh' | 'en' | 'fr' | 'it' | 'ru' | 'vi';
type LocaleEntry = [string, string];
type LocaleResource = LocaleEntry[];
type LocaleResources = Record<SupportedLanguage, LocaleResource>;
```

## 与 react-i18next 的兼容性

本包提供了与 react-i18next 类似的 API：

- `useTranslation()` hook
- `t()` 翻译函数
- `changeLanguage()` 语言切换
- 参数插值功能

主要区别在于语言包格式：本包专门处理 `[key, value]` 数组格式，而 react-i18next 使用对象格式。

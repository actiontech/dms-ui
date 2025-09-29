---
title: 组件总览
---

## 组件库简介

dms-kit 是一个基于 Ant Design 封装的业务组件库，提供统一的样式规范和增强的功能特性，支持 React 17 及以上版本。

## 快速上手

### 安装依赖

```bash
npm install @actiontech/dms-kit
```

### 基础用法

```tsx
import React from 'react';
import { ConfigProvider, BasicButton, BasicInput, BasicSelect } from '@actiontech/dms-kit';

const App = () => (
  <ConfigProvider>
    <BasicButton type="primary">按钮</BasicButton>
    <BasicInput placeholder="请输入内容" />
    <BasicSelect
      placeholder="请选择"
      options={[
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' }
      ]}
    />
  </ConfigProvider>
);

export default App;
```

## 定制主题

所有组件都支持主题系统，可通过 `ConfigProvider` 的 `theme` 和 `themeData` 属性进行配置。例如切换深色主题：

```
import React from 'react';
import { ConfigProvider, SupportTheme } from '@actiontech/dms-kit';

const App = () => (
  <ConfigProvider theme={SupportTheme.DARK}>
    {/* 你的应用 */}
  </ConfigProvider>
);

export default App;
```

## 国际化

组件库内置中英文语言包，可通过 `ConfigProvider` 的 `language` 和 `resources` 属性进行切换和扩展。例如切换英文：

```
import React from 'react';
import { ConfigProvider, SupportLanguage } from '@actiontech/dms-kit';

const App = () => (
  <ConfigProvider language={SupportLanguage.enUS}>
    {/* 你的应用 */}
  </ConfigProvider>
);

export default App;
```
---
title: 组件总览
---

## 组件库简介

dms-kit 是一个基于 Ant Design 封装的业务组件库，提供统一的样式规范和增强的功能特性，支持 React 17 及以上版本。

## 快速上手

### 安装依赖

```bash
npm install @actiontech/dms-kit
# 或
yarn add @actiontech/dms-kit
# 或
pnpm add @actiontech/dms-kit
```

## 组件特点

1. **统一样式**: 基于 Ant Design 封装，保持设计一致性
2. **TypeScript**: 完整的类型定义，提供良好的开发体验
3. **主题系统**: 支持亮色/暗色主题切换和自定义
4. **国际化**: 内置中英文语言包，支持扩展
5. **业务封装**: 针对常见业务场景提供开箱即用的解决方案

## 使用注意事项

1. **必须使用 ConfigProvider**：所有组件都需要包裹在 ConfigProvider 中才能正常工作
2. **版本兼容**：确保 React 版本 >= 17，Ant Design 版本与组件库匹配
3. **按需引入**：建议使用按需引入方式，减少打包体积
4. **类型支持**：使用 TypeScript 开发时，组件会提供完整的类型提示
5. **样式覆盖**：如需自定义样式，建议通过主题系统或 CSS Modules 实现

## 最佳实践

1. **统一封装**：在项目入口统一配置 ConfigProvider，包括主题、语言等
2. **类型安全**：充分利用 TypeScript 类型定义，避免运行时错误
3. **样式隔离**：避免直接修改组件样式，优先使用主题系统
4. **组件复用**：对于重复使用的业务场景，基于基础组件二次封装
5. **性能优化**：合理使用懒加载组件，避免不必要的渲染

## 相关资源

- [Ant Design 官方文档](https://ant.design/components/overview-cn)
- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)


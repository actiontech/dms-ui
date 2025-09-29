---
group:
  title: 交互组件
  order: 21
---

# HeaderProgress 头部进度条

基于 NProgress 库封装的头部进度条组件，提供了简洁的页面加载进度指示，适用于页面切换、数据加载等场景的进度反馈。

## 何时使用

- 需要在页面顶部显示加载进度时
- 需要为页面切换提供视觉反馈时
- 需要为异步操作显示进度指示时
- 需要保持与设计系统一致的进度条样式时
- 需要简洁的进度指示器时

## 代码演示



## API

### HeaderProgress

HeaderProgress 组件是一个无渲染组件，不接收任何 props，自动在组件挂载时启动进度条，在组件卸载时完成进度条。


### NProgress 配置

组件内部配置了 NProgress 的默认设置：

```typescript
Nprogress.configure({
  showSpinner: false  // 不显示旋转器
});

// 组件内部
useEffect(() => {
  Nprogress.start();
  return () => {
    Nprogress.done();
  };
}, []);
```



## 更新日志

- **1.0.0**: 初始版本，基于 NProgress 库封装
- 自动进度条管理
- 与 React 生命周期同步
- 简洁的进度指示效果
- 轻量级实现
- 完整的 TypeScript 类型支持
- 基于 NProgress 的可靠进度显示

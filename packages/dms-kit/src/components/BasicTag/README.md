---
group:
  title: 通用
  order: 1
---

# BasicTag 标签组件

## 组件介绍

BasicTag 是一个基于 Ant Design Tag 组件的封装，提供了统一的样式主题和丰富的颜色选项。该组件主要用于标记和分类，支持多种尺寸和颜色主题，适用于标签云、状态标识、分类展示等场景。

## 何时使用

- **状态标识**：标记任务状态、订单状态、系统状态等
- **分类标签**：对内容进行分类，如文章标签、产品分类等
- **筛选条件**：在搜索和筛选功能中显示已选择的条件
- **权限标识**：显示用户权限、角色标签等
- **标签云**：展示热门标签、关键词等

## 代码演示

### 基础用法

最简单的标签组件，支持基本的显示和关闭功能。

<code src="./demos/basic.tsx"></code>

### 不同颜色

BasicTag 支持多种预设颜色，满足不同场景的视觉需求。

<code src="./demos/color.tsx"></code>

### 不同尺寸

支持三种尺寸：small、default、large，适应不同的布局需求。

<code src="./demos/size.tsx"></code>

### 可关闭标签

支持关闭功能的标签，常用于筛选条件或临时标签。

<code src="./demos/closable.tsx"></code>

### 带图标的标签

在标签中添加图标，增强视觉效果和信息传达。

<code src="./demos/icon.tsx"></code>

### 状态标签

使用不同颜色表示不同的状态，常用于状态展示。

<code src="./demos/status.tsx"></code>


### 动态标签

支持动态添加、删除和编辑标签。

<code src="./demos/dynamic.tsx"></code>

## API 文档

### BasicTagProps

继承自 Ant Design 的 `TagProps`，并扩展了以下属性：

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 额外的 CSS 类名 | string | - | - |
| color | 标签颜色 | BasicTagColor | 'default' | - |
| size | 标签尺寸 | 'small' \| 'large' \| 'default' | 'default' | - |
| closable | 是否可关闭 | boolean | false | - |
| icon | 设置图标 | ReactNode | - | - |
| onClose | 关闭时的回调 | (e: React.MouseEvent\<HTMLElement\>) =\> void | - | - |
| children | 标签内容 | ReactNode | - | - |

### BasicTagColor

支持的颜色类型：

```
type BasicTagColor = 
  | 'default'    // 默认色
  | 'red'        // 红色
  | 'orange'     // 橙色
  | 'gold'       // 金色
  | 'green'      // 绿色
  | 'cyan'       // 青色
  | 'blue'       // 蓝色
  | 'geekblue'   // 极客蓝
  | 'purple'     // 紫色
  | 'Grape'      // 葡萄色
  | 'lilac'      // 丁香色
  | 'gray';      // 灰色
```

## 设计规范

### 主题配置

BasicTag 组件支持通过主题系统进行样式定制：

```
// 主题配置示例
const theme = {
  sharedTheme: {
    uiToken: {
      colorBorderSecondary: '#d9d9d9',  // 边框颜色
      colorBgBase: '#ffffff'             // 背景色
    },
    components: {
      basicTag: {
        default: {
          color: '#666666',
          backgroundColor: '#fafafa'
        },
        blue: {
          color: '#1890ff',
          backgroundColor: '#e6f7ff'
        },
        green: {
          color: '#52c41a',
          backgroundColor: '#f6ffed'
        }
        // ... 其他颜色配置
      }
    }
  }
};
```

### 尺寸规范

- **small**: 高度 22px，字体大小 12px，适合紧凑布局
- **default**: 高度 28px，字体大小 13px，标准尺寸
- **large**: 高度 32px，字体大小 13px，适合重要标签

### 颜色规范

- **默认色**: 使用主题的 `colorBorderSecondary` 和 `colorBgBase`
- **预设色**: 每种颜色都有对应的文字色和背景色
- **自定义色**: 支持通过 CSS 变量或内联样式自定义

### 间距规范

- **标签间距**: 标签之间使用 8px 的间距
- **内边距**: 水平内边距 6-8px，垂直内边距根据尺寸调整
- **图标间距**: 图标与文字之间使用 6px 的间距

### 交互规范

- **悬停效果**: 提供悬停时的视觉反馈
- **关闭按钮**: 关闭按钮有独立的悬停状态
- **双击编辑**: 支持双击标签进行编辑（需要自定义实现）
- **键盘支持**: 支持键盘导航和操作

## 注意事项

1. **颜色选择**: 选择合适的颜色组合，确保文字和背景的对比度
2. **标签数量**: 避免在一个区域放置过多标签，影响可读性
3. **动态操作**: 动态添加/删除标签时注意性能优化
4. **无障碍支持**: 确保标签有足够的对比度和可读性
5. **响应式设计**: 在不同屏幕尺寸下保持良好的显示效果

## 更新日志

### 1.0.0
- 初始版本发布
- 基于 Ant Design Tag 组件封装
- 支持多种预设颜色和尺寸
- 集成主题系统
- 提供统一的样式规范

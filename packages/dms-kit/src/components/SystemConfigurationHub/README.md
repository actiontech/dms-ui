---
group:
  title: 业务组件
  order: 3
---

# SystemConfigurationHub 系统配置中心

系统配置相关的组件和 hooks 合集，提供了构建复杂配置界面所需的所有工具，包括配置开关、测试功能、表单渲染等功能。

## 何时使用

- 需要构建系统配置页面时
- 需要带开关控制的配置项时
- 需要配置测试功能时
- 需要统一的配置界面样式和交互时
- 构建复杂的管理后台配置模块时

## 代码演示

### 基础配置界面

<code src="./demo/basic.tsx"></code>

<!-- ### 配置开关示例

<code src="./demo/configSwitch.tsx"></code>-->


### 只读模式展示

<code src="./demo/readOnlyMode.tsx"></code>

### 自定义配置界面

<code src="./demo/customConfig.tsx"></code> 

## API

### useConfigRender

核心配置渲染 hook，提供配置表单的完整渲染逻辑。

```typescript
const {
  modifyFlag,
  startModify,
  modifyFinish,
  extraButtonsVisible,
  renderConfigForm,
  form,
  enabled
} = useConfigRender<T>({
  switchFieldName: 'enabled',
  switchFieldLabel: '启用功能'
});
```

**参数**

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| switchFieldName | 开关字段名 | `keyof T` | - | - |
| switchFieldLabel | 开关字段标签 | `string \| ReactNode` | - | - |

**返回值**

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| modifyFlag | 是否处于修改模式 | `boolean` |
| startModify | 开始修改的方法 | `() => void` |
| modifyFinish | 完成修改的方法 | `() => void` |
| extraButtonsVisible | 额外按钮是否可见 | `boolean` |
| renderConfigForm | 渲染配置表单的方法 | `(params) => ReactNode` |
| form | 表单实例 | `FormInstance<T>` |
| enabled | 开关是否启用 | `boolean` |

**renderConfigForm 参数**

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 配置数据 | `T` | - |
| columns | 只读模式列配置 | `ReadOnlyConfigColumnsType<T>` | - |
| configExtraButtons | 额外按钮节点 | `ReactNode` | - |
| configSwitchNode | 配置开关节点 | `ReactNode` | - |
| configField | 配置字段节点 | `ReactNode` | - |
| submitButtonField | 提交按钮字段节点 | `ReactNode` | - |
| onSubmit | 表单提交回调 | `(values: T) => void` | - |

### useConfigSwitchControls

配置开关控制 hook，提供开关的状态管理和交互逻辑。

```typescript
const {
  configSwitchPopoverOpenState,
  generateConfigSwitchPopoverTitle,
  onConfigSwitchPopoverOpen,
  handleConfigSwitchChange,
  hiddenConfigSwitchPopover
} = useConfigSwitchControls(form, 'enabled');
```

**参数**

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| form | 表单实例 | `FormInstance<T>` | - |
| switchFieldName | 开关字段名 | `keyof T` | - |

**返回值**

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| configSwitchPopoverOpenState | 确认弹窗打开状态 | `boolean` |
| generateConfigSwitchPopoverTitle | 生成弹窗标题的方法 | `(modifyFlag, customTitle?) => string` |
| onConfigSwitchPopoverOpen | 弹窗打开状态变化回调 | `(open: boolean) => void` |
| handleConfigSwitchChange | 开关变化处理方法 | `(open, startModify) => void` |
| hiddenConfigSwitchPopover | 隐藏确认弹窗的方法 | `() => void` |

### renderReadOnlyModeConfig

只读模式配置渲染函数，用于展示配置信息。

```typescript
renderReadOnlyModeConfig({
  data: configData,
  columns: readOnlyColumns,
  modifyFlag: false
});
```

**参数**

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 配置数据 | `T` | - |
| columns | 列配置 | `ReadOnlyConfigColumnsType<T>` | - |
| modifyFlag | 是否处于修改模式 | `boolean` | - |

### ReadOnlyConfigColumnsType

只读模式列配置的类型定义。

```typescript
type ReadOnlyConfigColumnsType<T> = Array<{
  dataIndex: keyof T;
  label: string;
  hidden?: boolean;
  span?: number;
  render?: (val: T[K], record: T) => ReactNode;
}>;
```

## 组件 API

### ConfigSwitch

带确认弹窗的配置开关组件。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 确认弹窗标题 | `string` | - | - |
| switchFieldName | 开关字段名 | `string` | - | - |
| submitLoading | 是否提交中 | `boolean` | `false` | - |
| popoverVisible | 弹窗是否可见 | `boolean` | `false` | - |
| onConfirm | 确认回调 | `() => void` | - | - |
| onSwitchChange | 开关变化回调 | `(open: boolean) => void` | - | - |
| onSwitchPopoverOpen | 弹窗打开回调 | `(open: boolean) => void` | - | - |

继承 `BasicSwitch` 的所有属性。

### ConfigSubmitButtonField

配置提交按钮字段组件。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| submitLoading | 是否提交中 | `boolean` | `false` | - |
| handleClickCancel | 取消按钮点击回调 | `() => void` | - | - |

### ConfigTestBtn

配置测试按钮组件。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| popoverOpen | 弹窗是否打开 | `boolean` | `false` | - |
| onPopoverOpenChange | 弹窗状态变化回调 | `(open: boolean) => void` | - | - |
| popoverForm | 弹窗表单内容 | `ReactNode` | - | - |
| testingRef | 测试状态引用 | `MutableRefObject<boolean>` | - | - |

### ConfigModifyBtn

配置修改按钮组件。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| hidden | 是否隐藏 | `boolean` | `false` | - |
| onClick | 点击回调 | `() => void` | - | - |

### ConfigTestPopoverForm

配置测试弹窗表单组件。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| onTest | 测试回调 | `(values: any) => void` | - | - |
| testLoading | 是否测试中 | `boolean` | `false` | - |
| items | 表单项配置 | `Array<FormItemConfig>` | - | - |

## 设计规范

### 布局结构

- **开关区域**: 顶部显示功能开关和额外操作按钮
- **配置区域**: 开关启用时显示的配置表单
- **只读区域**: 开关关闭或非修改模式时的信息展示
- **操作区域**: 底部的提交和取消按钮

### 交互规范

- **开关操作**: 点击开关时显示确认弹窗
- **修改模式**: 点击修改按钮进入编辑状态
- **测试功能**: 点击测试按钮打开测试表单
- **表单提交**: 支持表单验证和加载状态

### 样式特性

- 统一的表单布局和间距
- 悬停效果和状态反馈
- 响应式布局支持
- 主题色彩系统集成

### 状态管理

- **只读状态**: 显示配置信息，不可编辑
- **编辑状态**: 显示表单字段，可以修改
- **加载状态**: 提交或测试时的加载反馈
- **确认状态**: 关键操作的确认弹窗

## 最佳实践

### 数据结构设计

```typescript
interface ConfigData {
  enabled: boolean; // 必须包含开关字段
  [key: string]: any; // 其他配置字段
}
```

### 表单验证

```typescript
const configField = (
  <FormItemLabel 
    label="服务器地址" 
    name="host" 
    rules={[
      { required: true, message: '请输入服务器地址' },
      { pattern: /^[a-zA-Z0-9.-]+$/, message: '请输入有效的服务器地址' }
    ]}
  >
    <Input placeholder="请输入服务器地址" />
  </FormItemLabel>
);
```

### 只读模式渲染

```typescript
const readOnlyColumns = [
  {
    label: '服务器地址',
    dataIndex: 'host',
    render: (val: string) => val || '--'
  },
  {
    label: '状态',
    dataIndex: 'status',
    render: (val: string) => (
      <Tag color={val === 'active' ? 'green' : 'red'}>
        {val === 'active' ? '正常' : '异常'}
      </Tag>
    )
  }
];
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `useConfigRender` 和 `useConfigSwitchControls` 需要配合使用
3. 表单字段名必须与数据结构中的字段名保持一致
4. 测试功能需要自行实现具体的测试逻辑
5. 只读模式的列配置支持自定义渲染函数来展示复杂内容
6. 建议为重要的配置变更提供确认弹窗来提升用户体验

## 更新日志

- **1.0.0**: 初始版本
  - 提供完整的配置界面构建工具
  - 支持开关控制、测试功能、只读展示
  - 内置表单验证和状态管理
  - 完整的组件库和 hooks 集合
  - 支持自定义渲染和主题系统
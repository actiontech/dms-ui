---
group:
  title: 业务组件
  order: 3
---

# EditableSelect 可编辑选择器

功能强大的可编辑选择器组件，支持选择、添加、编辑和删除选项，适用于需要动态管理选项列表的场景。

## 何时使用

- 需要动态管理选项列表时
- 用户需要自定义选项内容时
- 构建标签管理、类别管理等功能时
- 需要实时编辑下拉选项时
- 表单中需要可扩展的选择字段时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>


### 异步操作

<code src="./demo/async.tsx"></code>

### 表单集成

<code src="./demo/formIntegration.tsx"></code>

## API

### EditableSelect

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 当前选中的值 | `EditableSelectValue` | - | - |
| onChange | 选择变化时的回调 | `(value: EditableSelectValue) => void` | - | - |
| options | 选项数据源 | `EditableSelectOption[]` | `[]` | - |
| onAdd | 添加新选项时的回调 | `(value: string) => void` | - | - |
| onUpdate | 更新选项时的回调 | `(newData: EditableSelectOption) => void` | - | - |
| onDelete | 删除选项时的回调 | `(item: EditableSelectOption) => Promise<boolean> \| void` | - | - |
| addable | 是否允许添加新选项 | `boolean` | `true` | - |
| updatable | 是否允许编辑选项 | `boolean` | `true` | - |
| deletable | 是否允许删除选项 | `boolean` | `true` | - |
| addButtonText | 添加按钮的文本 | `string` | - | - |
| placeholder | 选择框占位符 | `string` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| loading | 是否显示加载状态 | `boolean` | `false` | - |
| deletionConfirmTitle | 删除确认弹窗的标题 | `ReactNode \| (option: EditableSelectOption) => ReactNode` | - | - |
| errorMessage | 错误信息，显示时会标红边框 | `string` | - | - |

### 数据结构

#### EditableSelectValue

```typescript
type EditableSelectValue = string | number;
```

#### EditableSelectOption

```typescript
interface EditableSelectOption {
  value: EditableSelectValue;
  label: string;
}
```

## 功能特性

### 基础功能

- **选择选项**: 点击选项进行选择
- **添加选项**: 点击 + 按钮添加新选项
- **编辑选项**: 点击编辑图标修改选项名称
- **删除选项**: 点击删除图标移除选项

### 状态管理

- **加载状态**: 显示加载动画，禁用所有操作
- **禁用状态**: 完全禁用组件交互
- **错误状态**: 显示错误信息和错误样式
- **空状态**: 无选项时的空状态展示

### 权限控制

- **addable**: 控制是否显示添加按钮
- **updatable**: 控制是否显示编辑按钮
- **deletable**: 控制是否显示删除按钮

### 交互体验

- **即时编辑**: 点击编辑后直接在下拉框内编辑
- **确认删除**: 支持删除前确认弹窗
- **键盘支持**: 编辑时支持 Enter 保存，Esc 取消
- **自动聚焦**: 编辑模式自动聚焦输入框

## 设计规范

### 布局结构

- **触发器**: 显示当前选中值的触发区域
- **下拉面板**: 包含选项列表和操作按钮的面板
- **选项行**: 每个选项包含内容、编辑和删除按钮
- **添加区域**: 底部的添加新选项区域

### 交互规范

- **悬停效果**: 选项悬停时显示操作按钮
- **编辑模式**: 点击编辑后替换为输入框
- **确认机制**: 删除操作需要确认
- **状态反馈**: 操作成功/失败的及时反馈

### 样式特性

- 统一的边框和圆角设计
- 清晰的状态区分（选中、悬停、禁用）
- 错误状态的红色边框提示
- 加载状态的动画效果

## 使用场景

### 1. 标签管理

```typescript
// 项目标签管理
<EditableSelect
  value={selectedTag}
  onChange={setSelectedTag}
  options={tags}
  onAdd={handleAddTag}
  onUpdate={handleUpdateTag}
  onDelete={handleDeleteTag}
  placeholder="选择或添加标签"
  addButtonText="新建标签"
/>
```

### 2. 环境配置

```typescript
// 部署环境管理
<EditableSelect
  value={environment}
  onChange={setEnvironment}
  options={environments}
  onAdd={handleAddEnvironment}
  placeholder="选择部署环境"
  deletionConfirmTitle="确定要删除这个环境配置吗？"
/>
```

### 3. 分类管理

```typescript
// 文档分类管理
<EditableSelect
  value={category}
  onChange={setCategory}
  options={categories}
  onAdd={handleAddCategory}
  onUpdate={handleUpdateCategory}
  addButtonText="新建分类"
  updatable={true}
  deletable={false} // 分类不允许删除
/>
```

## 最佳实践

### 异步操作处理

```typescript
const handleAsyncAdd = async (name: string) => {
  setLoading(true);
  try {
    const newOption = await api.createOption(name);
    setOptions(prev => [...prev, newOption]);
    message.success('添加成功');
  } catch (error) {
    message.error('添加失败');
  } finally {
    setLoading(false);
  }
};
```

### 删除前验证

```typescript
const handleDelete = async (option: EditableSelectOption): Promise<boolean> => {
  try {
    await api.deleteOption(option.value);
    setOptions(prev => prev.filter(opt => opt.value !== option.value));
    return true; // 删除成功
  } catch (error) {
    message.error('删除失败');
    return false; // 阻止删除
  }
};
```

### 表单集成

```typescript
<Form.Item
  label="选择类别"
  name="category"
  rules={[{ required: true, message: '请选择类别' }]}
>
  <EditableSelect
    placeholder="选择或创建类别"
    options={categories}
    onAdd={handleAddCategory}
  />
</Form.Item>
```

### 错误处理

```typescript
const [errorMessage, setErrorMessage] = useState('');

const handleAdd = (name: string) => {
  if (name.length < 2) {
    setErrorMessage('名称至少需要2个字符');
    return;
  }
  
  if (options.some(opt => opt.label === name)) {
    setErrorMessage('名称已存在');
    return;
  }
  
  // 添加成功，清除错误
  setErrorMessage('');
  // ... 添加逻辑
};

<EditableSelect
  errorMessage={errorMessage}
  // ... 其他属性
/>
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `onDelete` 回调支持返回 `Promise<boolean>` 来控制删除是否成功
3. 编辑和删除操作会自动阻止事件冒泡，避免触发选择
4. 建议为异步操作提供适当的加载状态和错误处理
5. `errorMessage` 属性设置后会显示错误样式，需要手动清除
6. 删除确认弹窗支持自定义内容，可以是字符串或 React 节点
7. 建议为选项设置有意义的 `value` 值，确保唯一性

## 更新日志

- **1.0.0**: 初始版本
  - 支持选择、添加、编辑、删除选项
  - 提供完整的状态管理（加载、禁用、错误）
  - 支持权限控制（addable、updatable、deletable）
  - 内置确认删除和错误处理机制
  - 完整的键盘交互支持
  - 响应式设计和主题系统集成

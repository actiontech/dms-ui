---
nav:
  title: 快速上手
  order: 1
---
# 常见问题

#### 搭配Button使用

<Badge type="success">正确使用</Badge>
```jsx | pure
<BasicButton
  icon={
    <MinusCircleFilled />
  }
/>
```


<Badge type="error">错误使用</Badge> 可能会导致icon 宽高被button的padding样式挤压
```jsx | pure
<BasicButton>
  <MinusCircleFilled />
</BasicButton>
```
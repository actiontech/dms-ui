---
nav:
  title: 快速上手
  order: 1
---

# 快速上手


**生成Icon组件(组件生成依赖[SVGR](https://react-svgr.com/docs/options/#ignore-existing))**

```shell
pnpm icon:g
```

**生成icon组件文档**

```shell
pnpm doc:g
```

**本地查看文档**

```shell
pnpm doc
```

**build文档产物**

```shell
pnpm doc:build
```

**build组件产物**

```shell
pnpm icon:build
```


**将svg放入svg对应分类文件夹下**

**样式分类(style)**

- **线框风格(outlined)**
- **实底风格(filled)**

**功能分类**

- **通用类图标(Common)**
- **方向类图标(Directional)**
- **编辑类图标(Editorial)**
- **提示建议类图标(Suggestive)**
- **数据类图标(Data)**

**命名规范**

```shell
{name}{style}.tsx 
```
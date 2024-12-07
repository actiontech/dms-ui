# CLI: create-dms-page

## 背景

在现有的 DMS-UI 架构下，添加一个新的页面需要以下步骤：

1. 添加菜单图标（SVG 文件）并生成对应的图标组件。
2. 添加菜单语言包数据以及页面语言包文件。
3. 添加页面路由配置数据，并在 ROUTE_PATHS 文件中新增对应的页面路径数据。
4. 添加菜单相关数据。

由于上述流程涉及多个分散在项目不同位置的文件，导致整个过程较为繁琐。因此，设计了本脚手架来自动化这些流程。

## 使用方式

### 前提条件

复制菜单图标 SVG 文件（可选）：粘贴板内容将用于生成菜单图标 SVG 文件。如果粘贴板内容不是 SVG 内容或没有内容，将使用默认 SVG 生成。请在流程结束后替换 SVG 内容并重新生成图标组件。

### 执行命令

在 dms-ui/dms-ui-ee 项目的根目录下执行以下命令：

`pnpm dms:g <page-type>`

其中 `<page-type>` 支持以下选项：

- base
- sqle
- provision

### 输入信息

执行命令后，系统将提示输入以下信息：

1. 菜单图标组件名称：用于生成菜单图标组件的名称。
2. 页面组件名称：用于生成页面组件的名称。
3. 页面的中文菜单标题：用于生成对应的菜单语言包。
4. 路由路径 (Route Path)：用于定义页面的 URL 路径。
5. 当前页面是否为项目内页面：用于生成最终的页面路径。

### 后续操作

手动添加菜单数据：生成结束后，需手动将生成的菜单数据添加至 menu.data.tsx 文件中。如果在 dms-ui-ee 仓库中添加 provision 类型的页面，则需要将数据添加至 menu.data.dms.tsx 文件中，用于确定新菜单在左侧菜单树上的具体位置。

>注意事项
>
>1. 格式要求：请确保输入的信息符合相应的格式要求。
>2. 项目结构关联：本脚手架与项目结构强关联。当相关联的代码或页面文件发生变动时，脚手架可能无法正常工作。快速找到相关联文件或变量的方法：在项目全局搜索 @warn/cli/create-dms-page。

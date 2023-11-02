
## <small> 2023-05-10 </small>

* 移除冗余页面 (用户中心、成员管理、数据源管理)
* 提取公共数据至 @actiontech/shared
* 修改 Logo 默认内容

mr地址: <http://10.186.18.21/dms/dms-ui/-/merge_requests/25>

## <small> 2023-05-12 </small>

* 将 useCurrentUser、useUserInfo 两个全局用户状态的 hooks 移至 @actiontech/shared
* 修改 Api.ts 中的 authInvalid, 调整为清空全局状态
* **由于sqle后端为 4.23 版本, 而前端 sqle 基本为最新版本, 所以在本次修改中还原了 sqle 中的部分功能**
  * <https://github.com/actiontech/sqle-ui/pull/256>
  * <https://github.com/actiontech/sqle-ui/pull/253>
  * <https://github.com/actiontech/sqle-ui/pull/252>
  * <https://github.com/actiontech/sqle-ui/pull/251>
* 将 sqle 中的 react-monaco-editor 替换为 @monaco-editor/react, 并将其提取至 @actiontech/shared

## <small> 2023-05-16 </small>

* 将 CustomLink 以及 CustomNavigate 迁移至 @actiontech/shared

## <small> 2023-05-19 </small>

* 解决 sqle 单元测试错误
* 移除登出 sqle 时调用的接口

## <small> 2023-05-22 </small>

* 在 ee 模式下隐藏项目导航，并在用户点击项目时自动跳转到当前在 dms 中选中的项目的概览页面。

export enum AdminRole {
  admin = 'admin'
}

export enum AdminUser {
  admin = 'admin'
}

export enum AdminRolePermission {
  // user
  AddRoleScopeMapping = 'auth.AddRoleScopeMapping',
  CreateRole = 'auth.CreateRole',
  CreateUser = 'auth.CreateUser',
  DeleteRole = 'auth.DeleteRole',
  DeleteRoleScopeMapping = 'auth.DeleteRoleScopeMapping',
  DeleteUser = 'auth.DeleteUser',
  GetRoleByName = 'auth.GetRoleByName',
  GetUserByName = 'auth.GetUserByName',
  ListRoleScopes = 'auth.ListRoleScopes',
  ListRoles = 'auth.ListRoles',
  ListScopes = 'auth.ListScopes',
  ListUsers = 'auth.ListUsers',
  UpdatePassword = 'auth.UpdatePassword',
  UpdateRole = 'auth.UpdateRole',
  UpdateUser = 'auth.UpdateUser',
  // database
  AddDB = 'db.AddDB',
  DeleteDB = 'db.DeleteDB',
  ListDBs = 'db.ListDBs',
  UpdateDB = 'db.UpdateDB',
  // monitor
  ListConfigs = 'monitor.ListConfigs',
  ListMetrics = 'monitor.ListMetrics',
  // server
  AddServer = 'server.AddServer',
  DeleteServer = 'server.DeleteServer',
  ListServers = 'server.ListServers',
  UpdateServer = 'server.UpdateServer'
}

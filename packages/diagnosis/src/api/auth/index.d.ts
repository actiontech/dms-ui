import {
  IUserLoginRequest,
  IUserLoginReply,
  IRoleCreateRequest,
  IGenericResp,
  IRoleDeleteRequest,
  IListRolesReply,
  IListScopesReply,
  IGetRoleReply,
  IRoleScopeCreateRequest,
  IRoleScopeDeleteRequest,
  IUserCreateRequest,
  IUserDeleteRequest,
  IListUsersReply,
  IUserUpdatePasswordRequest,
  IUserUpdateRoleRequest,
  IGetUserReply
} from '../common.d';

export interface IV1LoginParams extends IUserLoginRequest {}

export interface IV1LoginReturn extends IUserLoginReply {}

export interface IV1CreateRoleParams extends IRoleCreateRequest {}

export interface IV1CreateRoleReturn extends IGenericResp {}

export interface IV1DeleteRoleParams extends IRoleDeleteRequest {}

export interface IV1DeleteRoleReturn extends IGenericResp {}

export interface IV1ListRolesParams {
  fuzzy_search_keyword?: string;

  page_index?: number;

  page_size?: number;
}

export interface IV1ListRolesReturn extends IListRolesReply {}

export interface IV1ListRoleScopesParams {
  page_index?: number;

  page_size?: number;

  role_id?: number;
}

export interface IV1ListRoleScopesReturn extends IListScopesReply {}

export interface IV1GetRoleParams {
  role_id: string;
}

export interface IV1GetRoleReturn extends IGetRoleReply {}

export interface IV1CreateRoleScopeParams extends IRoleScopeCreateRequest {}

export interface IV1CreateRoleScopeReturn extends IGenericResp {}

export interface IV1DeleteRoleScopeParams extends IRoleScopeDeleteRequest {}

export interface IV1DeleteRoleScopeReturn extends IGenericResp {}

export interface IV1ListExistingScopesReturn extends IListScopesReply {}

export interface IV1CreateUserParams extends IUserCreateRequest {}

export interface IV1CreateUserReturn extends IGenericResp {}

export interface IV1DeleteUserParams extends IUserDeleteRequest {}

export interface IV1DeleteUserReturn extends IGenericResp {}

export interface IV1ListUsersParams {
  fuzzy_search_keyword?: string;

  page_index?: number;

  page_size?: number;
}

export interface IV1ListUsersReturn extends IListUsersReply {}

export interface IV1UpdateUserPasswordParams
  extends IUserUpdatePasswordRequest {}

export interface IV1UpdateUserPasswordReturn extends IGenericResp {}

export interface IV1UpdateUserRoleParams extends IUserUpdateRoleRequest {}

export interface IV1UpdateUserRoleReturn extends IGenericResp {}

export interface IV1GetUserParams {
  user_id: string;
}

export interface IV1GetUserReturn extends IGetUserReply {}

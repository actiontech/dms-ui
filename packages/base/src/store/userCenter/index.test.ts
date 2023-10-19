import reducers, {
  updateSelectUser,
  updateSelectUserGroup,
  updateSelectRole
} from '.';
import { IReduxState } from '..';
import {
  roleList,
  userGroupList,
  userList
} from '../../testUtils/mockApi/userCenter/data';

describe('test store/user-center', () => {
  const state: IReduxState['userCenter'] = {
    modalStatus: {},
    selectUser: null,
    selectUserGroup: null,
    selectRole: null
  };

  it('should create user', () => {
    expect(updateSelectUser({ user: userList[0] })).toEqual({
      type: 'userCenter/updateSelectUser',
      payload: {
        user: userList[0]
      }
    });
  });

  it('should update selectUser when dispatch updateSelectUser action', () => {
    const newState = reducers(
      state,
      updateSelectUser({
        user: userList[0]
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      selectUser: userList[0],
      selectUserGroup: null,
      selectRole: null
    });
  });

  it('should create userGroup', () => {
    expect(updateSelectUserGroup({ userGroup: userGroupList[0] })).toEqual({
      type: 'userCenter/updateSelectUserGroup',
      payload: {
        userGroup: userGroupList[0]
      }
    });
  });

  it('should update selectUserGroup when dispatch updateSelectUserGroup action', () => {
    const newState = reducers(
      state,
      updateSelectUserGroup({
        userGroup: userGroupList[0]
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      selectUser: null,
      selectUserGroup: userGroupList[0],
      selectRole: null
    });
  });

  it('should create role', () => {
    expect(updateSelectRole({ role: roleList[0] })).toEqual({
      type: 'userCenter/updateSelectRole',
      payload: {
        role: roleList[0]
      }
    });
  });

  it('should update selectRole when dispatch updateSelectRole action', () => {
    const newState = reducers(
      state,
      updateSelectRole({
        role: roleList[0]
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      selectUser: null,
      selectUserGroup: null,
      selectRole: roleList[0]
    });
  });
});

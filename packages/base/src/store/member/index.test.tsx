import { IReduxState } from '..';
import reducers, {
  updateSelectMember,
  updateSelectMemberGroup
} from '.';

describe('store/member', () => {
  const state: IReduxState['member'] = {
    modalStatus: {},
    selectMember: null,
    selectMemberGroup: null
  };

  it('should execute updateSelectMember', () => {
    const newState = reducers(
      state,
      updateSelectMember({
        member: { is_project_admin: true, user: { name: 'admin', uid: 'uid' } }
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      selectMember: {
        is_project_admin: true,
        user: { name: 'admin', uid: 'uid' }
      },
      selectMemberGroup: null
    });
  });

  it('should execute updateSelectMemberGroup', () => {
    const memberGroupData = { is_project_admin: true, users: [] };
    const newState = reducers(
      state,
      updateSelectMemberGroup({
        memberGroup: memberGroupData
      })
    );
    expect(newState).toEqual({
      modalStatus: {},
      selectMember: null,
      selectMemberGroup: memberGroupData
    });
  });
});

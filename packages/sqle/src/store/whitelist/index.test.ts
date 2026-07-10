import reducers, { updateSelectWhitelist } from '.';
import { IReduxState } from '..';
import { MatchConditionReqV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('store/user', () => {
  test('should create action', () => {
    expect(
      updateSelectWhitelist({
        selectRow: {
          audit_whitelist_id: 2,
          desc: 'desc',
          match_conditions: [
            {
              type: MatchConditionReqV1TypeEnum.sql,
              content: 'select a from b'
            }
          ]
        }
      })
    ).toEqual({
      payload: {
        selectRow: {
          audit_whitelist_id: 2,
          desc: 'desc',
          match_conditions: [
            {
              type: MatchConditionReqV1TypeEnum.sql,
              content: 'select a from b'
            }
          ]
        }
      },
      type: 'whitelist/updateSelectWhitelist'
    });
  });

  const state: IReduxState['whitelist'] = {
    selectWhitelist: null,
    modalStatus: {},
    detailDrawerOpen: false
  };

  test('should update selectUser when dispatch updateUser action', () => {
    const newState = reducers(
      state,
      updateSelectWhitelist({
        selectRow: {
          audit_whitelist_id: 2,
          desc: 'desc',
          match_conditions: [
            {
              type: MatchConditionReqV1TypeEnum.sql,
              content: 'select a from b'
            }
          ]
        }
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectWhitelist: {
        audit_whitelist_id: 2,
        desc: 'desc',
        match_conditions: [
          {
            type: MatchConditionReqV1TypeEnum.sql,
            content: 'select a from b'
          }
        ]
      },
      modalStatus: {},
      detailDrawerOpen: false
    });
  });
});

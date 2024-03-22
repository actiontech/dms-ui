import reducers, { updatePluginAuditRecord } from '.';
import { IReduxState } from '..';
import { sqlDEVRecordListMockData } from '../../testUtils/mockApi/sqlDEVRecord/data';

describe('store/pluginAudit', () => {
  test('should create action', () => {
    expect(
      updatePluginAuditRecord({
        pluginAuditRecord: sqlDEVRecordListMockData[0]
      })
    ).toEqual({
      payload: {
        pluginAuditRecord: sqlDEVRecordListMockData[0]
      },
      type: 'pluginAudit/updatePluginAuditRecord'
    });
  });

  const state: IReduxState['pluginAudit'] = {
    pluginAuditRecord: null,
    modalStatus: {}
  };

  test('should update pluginAuditRecord when dispatch updatePluginAuditRecord action', () => {
    const newState = reducers(
      state,
      updatePluginAuditRecord({
        pluginAuditRecord: sqlDEVRecordListMockData[0]
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      pluginAuditRecord: sqlDEVRecordListMockData[0],
      modalStatus: {}
    });
  });
});

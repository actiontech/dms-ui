import reducers, { updateSelectServerMonitorData } from '.';
import { IReduxState } from '..';

const serverMonitorSourceList = [{}];

describe('store/monitorSourceConfig', () => {
  test('should create action', () => {
    expect(updateSelectServerMonitorData(null)).toEqual({
      payload: null,
      type: 'monitorSourceConfig/updateSelectServerMonitorData'
    });
    expect(updateSelectServerMonitorData(serverMonitorSourceList[0])).toEqual({
      payload: {},
      type: 'monitorSourceConfig/updateSelectServerMonitorData'
    });
  });

  const state: IReduxState['monitorSourceConfig'] = {
    modalStatus: {},
    selectServerMonitorData: null
  };

  test('should update select data when dispatch updateSelectServerMonitorData action', () => {
    const newState = reducers(
      state,
      updateSelectServerMonitorData(serverMonitorSourceList[0])
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      selectServerMonitorData: serverMonitorSourceList[0]
    });
  });
});

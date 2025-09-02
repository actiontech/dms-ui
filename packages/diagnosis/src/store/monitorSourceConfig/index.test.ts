import monitorSourceConfig, {
  initMonitorSourceConfigModalStatus,
  updateMonitorSourceConfigModalStatus,
  updateSelectServerMonitorData,
  updateSelectDatabaseMonitorData,
  updateSelectMonitorConfigData
} from '.';
import {
  databaseMonitorListData,
  monitorRoutineListData,
  serverMonitorListData
} from '../../testUtils/mockApi/monitorSourceConfig/data';

const initStore = {
  modalStatus: {},
  selectServerMonitorData: null,
  selectDatabaseMonitor: null,
  selectMonitorConfigDta: null
};

describe('store/monitorSourceConfig', () => {
  test('should create action', () => {
    expect(
      initMonitorSourceConfigModalStatus({ modalStatus: { test: true } })
    ).toEqual({
      payload: {
        modalStatus: {
          test: true
        }
      },
      type: 'monitorSourceConfig/initModalStatus'
    });
    expect(
      updateMonitorSourceConfigModalStatus({ modalName: 'test', status: false })
    ).toEqual({
      payload: {
        modalName: 'test',
        status: false
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
    expect(updateSelectServerMonitorData(null)).toEqual({
      payload: null,
      type: 'monitorSourceConfig/updateSelectServerMonitorData'
    });
    expect(updateSelectDatabaseMonitorData(null)).toEqual({
      payload: null,
      type: 'monitorSourceConfig/updateSelectDatabaseMonitorData'
    });
    expect(updateSelectMonitorConfigData(null)).toEqual({
      payload: null,
      type: 'monitorSourceConfig/updateSelectMonitorConfigData'
    });
  });

  test('should update select server monitor data', async () => {
    const store = { ...initStore };
    const newStore = monitorSourceConfig(
      store,
      updateSelectServerMonitorData(serverMonitorListData[0])
    );
    expect(newStore).not.toBe(store);
    expect(newStore.selectServerMonitorData).toEqual(serverMonitorListData[0]);
  });
  test('should update select database monitor data', () => {
    const store = { ...initStore };
    const newStore = monitorSourceConfig(
      store,
      updateSelectDatabaseMonitorData(databaseMonitorListData[0])
    );
    expect(newStore).not.toBe(store);
    expect(newStore.selectDatabaseMonitor).toEqual(databaseMonitorListData[0]);
  });
  test('should update select monitor config data', () => {
    const store = { ...initStore };
    const newStore = monitorSourceConfig(
      store,
      updateSelectMonitorConfigData(monitorRoutineListData[0])
    );
    expect(newStore).not.toBe(store);
    expect(newStore.selectMonitorConfigDta).toEqual(monitorRoutineListData[0]);
  });
});

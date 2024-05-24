import { act, renderHook } from '@testing-library/react';
import useSharedStepDetail from '../useSharedStepDetail';

describe('test useSharedStepDetail', () => {
  it('should correctly update the value using set', () => {
    const { result } = renderHook(() => useSharedStepDetail());

    expect(result.current.isAuditing.value).toEqual(false);
    act(() => {
      result.current.isAuditing.set(true);
    });
    expect(result.current.isAuditing.value).toEqual(true);

    expect(result.current.isDisabledForDifferenceSql.value).toEqual(false);
    act(() => {
      result.current.isDisabledForDifferenceSql.set(true);
    });
    expect(result.current.isDisabledForDifferenceSql.value).toEqual(true);

    expect(result.current.instanceTestConnectResults.value).toEqual([]);
    act(() => {
      result.current.instanceTestConnectResults.set([
        { is_instance_connectable: true, instance_name: 'mysql-1' }
      ]);
    });
    expect(result.current.instanceTestConnectResults.value).toEqual([
      { is_instance_connectable: true, instance_name: 'mysql-1' }
    ]);

    expect(result.current.sqlStatementTabActiveKey.value).toEqual('');
    act(() => {
      result.current.sqlStatementTabActiveKey.set('123');
    });
    expect(result.current.sqlStatementTabActiveKey.value).toEqual('123');

    expect(result.current.dbSourceInfoCollection.value).toEqual({ '0': {} });

    // update
    act(() => {
      result.current.dbSourceInfoCollection.set('0', {
        instanceName: 'mysql-1',
        schemaList: ['test']
      });
    });
    expect(result.current.dbSourceInfoCollection.value).toEqual({
      '0': { instanceName: 'mysql-1', schemaList: ['test'] }
    });

    // merge
    act(() => {
      result.current.dbSourceInfoCollection.set('0', {
        dbType: 'MySQL'
      });
    });
    expect(result.current.dbSourceInfoCollection.value).toEqual({
      '0': { instanceName: 'mysql-1', schemaList: ['test'], dbType: 'MySQL' }
    });

    // add
    act(() => {
      result.current.dbSourceInfoCollection.set('1', {
        instanceName: 'mysql-2'
      });
    });
    expect(result.current.dbSourceInfoCollection.value).toEqual({
      '0': { instanceName: 'mysql-1', schemaList: ['test'], dbType: 'MySQL' },
      '1': { instanceName: 'mysql-2' }
    });

    //clear
    act(() => {
      result.current.dbSourceInfoCollection.set('1', {});
    });
    expect(result.current.dbSourceInfoCollection.value).toEqual({
      '0': { instanceName: 'mysql-1', schemaList: ['test'], dbType: 'MySQL' },
      '1': {}
    });

    //remove
    act(() => {
      result.current.dbSourceInfoCollection.set('1');
    });
    expect(result.current.dbSourceInfoCollection.value).toEqual({
      '0': { instanceName: 'mysql-1', schemaList: ['test'], dbType: 'MySQL' }
    });

    //reset all state
    act(() => {
      result.current.resetAllSharedData();
    });
    expect(result.current.isAuditing.value).toEqual(false);
    expect(result.current.isDisabledForDifferenceSql.value).toEqual(false);
    expect(result.current.instanceTestConnectResults.value).toEqual([]);
    expect(result.current.sqlStatementTabActiveKey.value).toEqual('');
    expect(result.current.dbSourceInfoCollection.value).toEqual({ '0': {} });
  });
});

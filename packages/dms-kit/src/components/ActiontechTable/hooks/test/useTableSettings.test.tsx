import { act, cleanup, renderHook } from '@testing-library/react';
import useTableSettings from '../useTableSettings';
import { LocalStorageWrapper } from '@actiontech/dms-kit';
import { eventEmitter } from '@actiontech/dms-kit/es/utils/EventEmitter';
import EmitterKey from '@actiontech/dms-kit/es/data/EmitterKey';

describe('lib/ActiontechTable-hooks-useTableSettings', () => {
  const tableName = 'tableList';
  const username = 'admin';
  const mockColumns = [
    {
      dataIndex: 'id',
      title: 'id'
    },
    {
      dataIndex: 'name',
      title: 'name'
    }
  ];
  const tableData = {
    [username]: {
      id: {
        order: 1,
        show: true,
        title: 'id'
      },
      name: {
        order: 2,
        show: true,
        title: 'name'
      }
    }
  };

  beforeEach(() => {
    cleanup();
  });

  it('render init hooks data empty', async () => {
    const { result } = renderHook(() => useTableSettings(tableName, username));
    await act(async () => {
      const res = result.current.localColumns;
      expect(res).toBe(undefined);
    });
  });

  it('render init hooks has data', async () => {
    jest
      .spyOn(LocalStorageWrapper, 'getOrDefault')
      .mockReturnValue(JSON.stringify(tableData));
    const { result } = renderHook(() => useTableSettings(tableName, username));
    await act(async () => {
      const res = result.current.localColumns;
      expect(res).toEqual(tableData[username]);
    });
  });

  it('render use catchDefaultColumnsInfo when has localStorage', async () => {
    jest
      .spyOn(LocalStorageWrapper, 'get')
      .mockReturnValue(JSON.stringify(tableData));

    // add columns
    const { result: addColumnsResult } = renderHook(() =>
      useTableSettings(tableName, username)
    );
    await act(async () => {
      addColumnsResult.current.catchDefaultColumnsInfo([
        ...mockColumns,
        {
          dataIndex: 'sex',
          title: '性别'
        }
      ]);
    });

    expect(addColumnsResult.current.localColumns).toEqual({
      ...tableData[username],
      sex: {
        order: 3,
        title: '性别',
        fixed: undefined,
        show: true
      }
    });
    cleanup();

    // update column title
    const { result: updateColumnTitleResult } = renderHook(() =>
      useTableSettings(tableName, username)
    );
    await act(async () => {
      updateColumnTitleResult.current.catchDefaultColumnsInfo([
        mockColumns[0],
        {
          ...mockColumns[1],
          title: 'update name'
        }
      ]);
    });

    expect(updateColumnTitleResult.current.localColumns).toEqual({
      ...tableData[username],
      name: {
        ...tableData[username].name,
        title: 'update name'
      }
    });
    cleanup();

    // update&delete columns
    const { result } = renderHook(() => useTableSettings(tableName, username));
    await act(async () => {
      result.current.catchDefaultColumnsInfo([
        {
          dataIndex: 'sex',
          title: '性别'
        }
      ]);
    });

    expect(result.current.localColumns).toEqual({
      sex: {
        order: 1,
        title: '性别',
        fixed: undefined,
        show: true
      }
    });
  });

  it('render use catchDefaultColumnsInfo  when no localStorage', async () => {
    jest.spyOn(LocalStorageWrapper, 'get').mockReturnValue(JSON.stringify({}));
    const emitSpy = jest.spyOn(eventEmitter, 'emit');

    const { result } = renderHook(() => useTableSettings(tableName, username));

    const LocalStorageWrapperSet = jest.spyOn(LocalStorageWrapper, 'set');
    await act(async () => {
      result.current.catchDefaultColumnsInfo([
        {
          dataIndex: 'sex',
          title: '性别'
        }
      ]);
      expect(LocalStorageWrapperSet).toHaveBeenCalledTimes(1);
      expect(LocalStorageWrapperSet).toHaveBeenCalledWith(
        tableName,
        JSON.stringify({
          [username]: {
            sex: {
              order: 1,
              show: true,
              title: '性别'
            }
          }
        })
      );
      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(
        EmitterKey.UPDATE_LOCAL_COLUMNS,
        {
          sex: {
            fixed: undefined,
            order: 1,
            show: true,
            title: '性别'
          }
        },
        tableName,
        username
      );
    });
  });
});

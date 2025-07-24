import { act } from '@testing-library/react';
import { sqleSuperRenderHook } from '../../../../testUtils/superRender';

import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { tableSchemas } from '../../__testData__';
import { resolveThreeSecond } from '../../../../testUtils/mockRequest';

import useTableSchema from '../useTableSchema';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('SqlAnalyze/useTableSchema', () => {
  describe('render generateTableSchemaContent', () => {
    it('render ele when isShow is false', async () => {
      const { result } = sqleSuperRenderHook(() => useTableSchema());

      await act(async () => {
        const tableSchemasNoShow = result.current.generateTableSchemaContent({
          isShow: false,
          errorMessage: '',
          tableMeta: {}
        });
        expect(tableSchemasNoShow).toMatchSnapshot();
      });
    });

    it('render ele when hasError info', async () => {
      const { result } = sqleSuperRenderHook(() => useTableSchema());

      await act(async () => {
        const tableSchemasError = result.current.generateTableSchemaContent({
          isShow: true,
          errorMessage: 'tableSchemas ERROR',
          tableMeta: {}
        });
        expect(tableSchemasError).toMatchSnapshot();
      });
    });

    it('render ele when has data', async () => {
      const { result } = sqleSuperRenderHook(() => useTableSchema());

      await act(async () => {
        const tableSchemasData = result.current.generateTableSchemaContent({
          isShow: true,
          errorMessage: '',
          tableMeta: tableSchemas[1].tableMeta
        });
        expect(tableSchemasData).toMatchSnapshot();
      });
    });

    it('render ele when tableMeta hasError message', async () => {
      const { result } = sqleSuperRenderHook(() => useTableSchema());

      await act(async () => {
        const tableSchemasError = result.current.generateTableSchemaContent({
          isShow: true,
          errorMessage: 'tableSchemas ERROR',
          tableMeta: { message: 'error' }
        });
        expect(tableSchemasError).toMatchSnapshot();
      });
    });
  });

  describe('render table Schema data', () => {
    const tableData = {
      columns: {
        rows: [
          {
            id: '1',
            select_type: 'SIMPLE'
          }
        ],
        head: [
          { field_name: 'id', desc: '' },
          { field_name: 'select_type', desc: '' }
        ]
      },
      indexes: {
        rows: [
          {
            id: '1',
            select_type: 'SIMPLE'
          }
        ],
        head: [
          { field_name: 'id', desc: '' },
          { field_name: 'select_type', desc: '' }
        ]
      },
      create_table_sql: 'select * user',
      name: 'name1',
      schema: 'schema1'
    };
    const mockGetAnalyzeData = () => {
      const spy = jest.spyOn(instance, 'getTableMetadata');
      spy.mockImplementation(() => resolveThreeSecond(tableData));
      return spy;
    };

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it('it render table Schemas data when have not options data', async () => {
      const { result } = sqleSuperRenderHook(() => useTableSchema({}));

      await act(async () => {
        result.current.getTableSchemas('table-test-name', 'default-name');
        expect(result.current.tableSchemas).toEqual([]);
      });
    });

    it('it render table Schemas data', async () => {
      const spy = mockGetAnalyzeData();
      const { result } = sqleSuperRenderHook(() =>
        useTableSchema({
          schemaName: 'test-schema-name',
          dataSourceName: 'dataSource-name'
        })
      );

      await act(async () => {
        result.current.getTableSchemas('table-test-name', 'default-name');
        expect(result.current.tableSchemas).toMatchSnapshot();
        await act(async () => jest.advanceTimersByTime(3300));
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith({
          instance_name: 'dataSource-name',
          schema_name: 'test-schema-name',
          table_name: 'table-test-name',
          project_name: 'default-name'
        });
        expect(result.current.tableSchemas).toMatchSnapshot();
      });

      await act(async () => {
        result.current.closeTableSchema('1');
        expect(result.current.tableSchemas).toMatchSnapshot();
      });
    });

    it('get table Schemas data error', async () => {
      const spy = mockGetAnalyzeData();
      spy.mockImplementation(() =>
        createSpySuccessResponse({ data: [], message: 'error', code: 500 })
      );
      const { result } = sqleSuperRenderHook(() =>
        useTableSchema({
          schemaName: 'test-schema-name',
          dataSourceName: 'dataSource-name'
        })
      );

      await act(async () => {
        result.current.getTableSchemas('table-test-name', 'default-name');
        expect(result.current.tableSchemas).toMatchSnapshot();
        await act(async () => jest.advanceTimersByTime(3300));
        expect(spy).toBeCalled();
        expect(spy).toBeCalledWith({
          instance_name: 'dataSource-name',
          schema_name: 'test-schema-name',
          table_name: 'table-test-name',
          project_name: 'default-name'
        });
        expect(result.current.tableSchemas).toMatchSnapshot();
      });

      await act(async () => {
        result.current.closeTableSchema('1');
        expect(result.current.tableSchemas).toMatchSnapshot();
      });
    });
  });
});

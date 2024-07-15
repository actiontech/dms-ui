import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { superRender } from '../../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import BatchImportDataSourceForm from '.';
import project from '../../../../testUtils/mockApi/project';
import { BatchImportDataSourceFormValueType } from '../index.type';
import { Form } from 'antd';
import { IDBService } from '@actiontech/shared/lib/api/base/service/common';
import { mockBatchImportDBCheckData } from '../../../../testUtils/mockApi/project/data';
import { FileUploadCheckStatusType } from '../index.type';

describe('base/Project/BatchImportDataSourceForm', () => {
  let getImportDBServicesTemplateSpy: jest.SpyInstance;

  beforeEach(() => {
    getImportDBServicesTemplateSpy = project.getImportDBServicesTemplate();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (
    dbServices?: IDBService[],
    uploadCheckStatus: FileUploadCheckStatusType = { success: true }
  ) => {
    const mockCustomRequest = jest.fn();
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<BatchImportDataSourceFormValueType>()
    );
    return superRender(
      <BatchImportDataSourceForm
        customRequest={mockCustomRequest}
        form={result.current[0]}
        dbServices={dbServices}
        uploadCheckStatus={uploadCheckStatus}
        clearUploadCheckStatus={jest.fn()}
      />
    );
  };

  test('render init snap', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('请选择导入文件')).toBeInTheDocument();
    expect(screen.getByText('下载导入模板')).toBeInTheDocument();
    expect(screen.getByText('批量测试数据源连通性')).toBeInTheDocument();
    expect(
      screen.getByText('批量测试数据源连通性').closest('button')
    ).toBeDisabled();
  });

  test('render init snap', async () => {
    customRender();
    fireEvent.click(screen.getByText('下载导入模板'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getImportDBServicesTemplateSpy).toHaveBeenCalledTimes(1);
  });

  test('render test connection', async () => {
    customRender(mockBatchImportDBCheckData);
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText('批量测试数据源连通性').closest('button')
    ).not.toBeDisabled();
  });

  test('render upload file error', async () => {
    customRender([], { success: false, errorMessage: 'test error' });
  });
});

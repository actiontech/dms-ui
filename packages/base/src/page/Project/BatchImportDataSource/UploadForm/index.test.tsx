import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import { baseSuperRender } from '../../../../testUtils/superRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import BatchImportDataSourceForm from '.';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import { BatchImportDataSourceFormValueType } from '../index.type';
import { Form } from 'antd';
import { IDBService } from '@actiontech/shared/lib/api/base/service/common';
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
    const { result } = superRenderHook(() =>
      Form.useForm<BatchImportDataSourceFormValueType>()
    );
    return baseSuperRender(
      <BatchImportDataSourceForm
        customRequest={mockCustomRequest}
        form={result.current[0]}
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
  });

  test('render init snap', async () => {
    customRender();
    fireEvent.click(screen.getByText('下载导入模板'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getImportDBServicesTemplateSpy).toHaveBeenCalledTimes(1);
  });

  test('render upload file error', async () => {
    customRender([], { success: false, errorMessage: 'test error' });
  });
});

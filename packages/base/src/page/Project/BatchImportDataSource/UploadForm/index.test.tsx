import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { superRender } from '../../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import BatchImportDataSourceForm from '.';
import project from '../../../../testUtils/mockApi/project';
import { BatchImportDataSourceFormValueType } from '../index.type';
import { Form } from 'antd';

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

  const customRender = () => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<BatchImportDataSourceFormValueType>()
    );
    return superRender(<BatchImportDataSourceForm form={result.current[0]} />);
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
});

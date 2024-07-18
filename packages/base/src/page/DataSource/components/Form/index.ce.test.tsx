/**
 * @test_version ce
 */
import { superRender } from '../../../../testUtils/customRender';
import { cleanup, screen, act } from '@testing-library/react';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import project from '../../../../testUtils/mockApi/project';
import { Form } from 'antd';
import { DataSourceFormField } from './index.type';
import dms from '../../../../testUtils/mockApi/global';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';
import DataSourceForm from '.';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('page/DataSource/DataSourceForm CE', () => {
  const submitFn = jest.fn();
  let getProjectTipsSpy: jest.SpyInstance;
  const customRender = (params?: {
    isUpdate: boolean;
    defaultData?: IListDBService;
  }) => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<DataSourceFormField>()
    );
    const isUpdate = params?.isUpdate ?? false;
    const defaultData = params?.defaultData ?? {};
    return superRender(
      <DataSourceForm
        form={result.current[0]}
        defaultData={defaultData}
        isUpdate={isUpdate}
        submit={submitFn}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    getProjectTipsSpy = project.getProjectTips();
    dms.mockAllApi();
    ruleTemplate.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render business field when getProjectTips api have not been called', async () => {
    mockUseCurrentProject();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getProjectTipsSpy).not.toHaveBeenCalled();
    expect(screen.getByText('添加数据源')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});

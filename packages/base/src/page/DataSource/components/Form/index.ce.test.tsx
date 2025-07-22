/**
 * @test_version ce
 */
import { baseSuperRender } from '../../../../testUtils/superRender';
import { cleanup, screen, act } from '@testing-library/react';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import { Form } from 'antd';
import { DataSourceFormField } from './index.type';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import ruleTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { IListDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import DataSourceForm from '.';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('page/DataSource/DataSourceForm CE', () => {
  const submitFn = jest.fn();
  let getProjectTipsSpy: jest.SpyInstance;
  const customRender = (params?: {
    isUpdate: boolean;
    defaultData?: IListDBServiceV2;
  }) => {
    const { result } = superRenderHook(() =>
      Form.useForm<DataSourceFormField>()
    );

    return baseSuperRender(
      <DataSourceForm
        form={result.current[0]}
        defaultData={params?.defaultData}
        isUpdate={params?.isUpdate}
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

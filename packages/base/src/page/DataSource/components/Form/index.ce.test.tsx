/**
 * @test_version ce
 */
import { baseSuperRender } from '../../../../testUtils/superRender';
import { cleanup, screen, act } from '@testing-library/react';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import { Form } from 'antd';
import { DataSourceFormField } from './index.type';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import ruleTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { IListDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import DataSourceForm from '.';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('page/DataSource/DataSourceForm CE', () => {
  const submitFn = jest.fn();
  const customRender = (params?: {
    isUpdate: boolean;
    defaultData?: IListDBServiceV2;
  }) => {
    const { result } = superRenderHook(() =>
      Form.useForm<DataSourceFormField>()
    );
    const isUpdate = params?.isUpdate ?? false;
    const defaultData = params?.defaultData ?? {};
    return baseSuperRender(
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
    expect(screen.getByText('添加数据源')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});

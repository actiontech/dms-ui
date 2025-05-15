import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { act, cleanup } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import {
  superRender,
  superRenderHook
} from '@actiontech/shared/lib/testUtil/superRender';
import BaseInfoForm from '.';
import configuration from '../../../../testUtils/mockApi/configuration';
import { Form } from 'antd';
import { RuleTemplateBaseInfoFields } from './index.type';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('sqle/RuleTemplate/BaseInfoForm', () => {
  const dispatchSpy = jest.fn();
  let getDriversSpy: jest.SpyInstance;
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    getDriversSpy = configuration.getDrivers();
    mockUsePermission(undefined, {
      useSpyOnMockHooks: true
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { result } = superRenderHook(() =>
      Form.useForm<RuleTemplateBaseInfoFields>()
    );
    const { baseElement } = superRender(
      <BaseInfoForm
        mode="create"
        form={result.current[0]}
        projectName={mockProjectInfo.projectName}
        submitLoading={false}
        submit={jest.fn()}
        ruleListLoading={false}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('should disabled dbType when form mode is import', async () => {
    const { result } = superRenderHook(() =>
      Form.useForm<RuleTemplateBaseInfoFields>()
    );
    const { getByLabelText } = superRender(
      <BaseInfoForm
        mode="import"
        form={result.current[0]}
        projectName={mockProjectInfo.projectName}
        submitLoading={false}
        submit={jest.fn()}
        ruleListLoading={false}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getByLabelText('数据库类型')).toBeDisabled();
  });
});

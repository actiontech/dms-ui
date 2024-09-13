import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { act, cleanup } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import {
  renderWithReduxAndTheme,
  renderHooksWithTheme
} from '@actiontech/shared/lib/testUtil/customRender';
import BaseInfoForm from '.';
import configuration from '../../../../testUtils/mockApi/configuration';
import { Form } from 'antd';
import { RuleTemplateBaseInfoFields } from './index.type';
import { mockUseCurrentPermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentPermission';

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
    mockUseCurrentPermission();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<RuleTemplateBaseInfoFields>()
    );
    const { baseElement } = renderWithReduxAndTheme(
      <BaseInfoForm
        mode="create"
        form={result.current[0]}
        projectName={mockProjectInfo.projectName}
        submitLoading={false}
        submit={jest.fn()}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('should disabled dbType when form mode is import', async () => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<RuleTemplateBaseInfoFields>()
    );
    const { getByLabelText } = renderWithReduxAndTheme(
      <BaseInfoForm
        mode="import"
        form={result.current[0]}
        projectName={mockProjectInfo.projectName}
        submitLoading={false}
        submit={jest.fn()}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getByLabelText('数据库类型')).toBeDisabled();
  });
});

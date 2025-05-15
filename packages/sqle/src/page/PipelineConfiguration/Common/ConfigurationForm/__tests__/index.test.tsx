import PipelineConfigurationForm from '../';
import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import { mockPipelineDetailData } from '../../../../../testUtils/mockApi/pipeline/data';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  superRender,
  superRenderHook
} from '@actiontech/shared/lib/testUtil/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import configuration from '../../../../../testUtils/mockApi/configuration';
import instance from '../../../../../testUtils/mockApi/instance';
import rule_template from '../../../../../testUtils/mockApi/rule_template';
import { instanceInfoMockData } from '../../../../../testUtils/mockApi/instance/data';
import { projectRuleTemplateList } from '../../../../../testUtils/mockApi/rule_template/data';
import { Form } from 'antd';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('sqle//PipelineConfiguration/Form', () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  const pipelineId = mockPipelineDetailData.id;

  let getDriversSpy: jest.SpyInstance;
  let getProjectRuleTemplateTipSpy: jest.SpyInstance;
  let getInstanceSpy: jest.SpyInstance;
  let getGlobalRuleTemplateTipSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    useParamsMock.mockReturnValue({ id: pipelineId });
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    getDriversSpy = configuration.getDrivers();
    getProjectRuleTemplateTipSpy = rule_template.getProjectRuleTemplateTips();
    getGlobalRuleTemplateTipSpy = rule_template.getRuleTemplateTips();
    instance.getInstanceTipList();
    getInstanceSpy = instance.getInstance();
    getInstanceSpy.mockClear();
    getInstanceSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...instanceInfoMockData,
          rule_template: {
            name: projectRuleTemplateList[0].rule_template_name,
            is_global_rule_template: true
          }
        }
      })
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (isEditionMode = false) => {
    const { result } = superRenderHook(() => Form.useForm());
    const { baseElement } = superRender(
      <Form colon={false} form={result.current[0]}>
        <PipelineConfigurationForm isEditionMode={isEditionMode} />
      </Form>
    );
    return { baseElement, form: result.current[0] };
  };

  it('render init snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(getProjectRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalRuleTemplateTipSpy).toHaveBeenCalledTimes(1);
  });

  it('render node modal', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('添加节点'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('创建节点')).toBeVisible();
    expect(baseElement).toMatchSnapshot();
  });

  it('render form when isEditionMode is truth', async () => {
    const { baseElement } = customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('#name')).toBeDisabled();
    expect(baseElement).toMatchSnapshot();
  });
});

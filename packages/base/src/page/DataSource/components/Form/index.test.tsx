import { superRender } from '../../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import project from '../../../../testUtils/mockApi/project';
import { mockProjectList } from '../../../../testUtils/mockApi/project/data';
import { Form } from 'antd';
import { DataSourceFormField } from './index.type';
import dms from '../../../../testUtils/mockApi/global';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';
import { DBServicesList } from '../../../../testUtils/mockApi/global/data';
import { IListDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import system from 'sqle/src/testUtils/mockApi/system';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';

import DataSourceForm from '.';

describe('page/DataSource/DataSourceForm', () => {
  const submitFn = jest.fn();
  let listEnvironmentTagsSpy: jest.SpyInstance;
  let getProjectListSpy: jest.SpyInstance;
  let getSystemModuleStatusSpy: jest.SpyInstance;
  const customRender = (params?: {
    isUpdate: boolean;
    defaultData?: IListDBServiceV2;
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
    getProjectListSpy = project.getProjectList();
    listEnvironmentTagsSpy = project.listEnvironmentTags();
    getSystemModuleStatusSpy = system.getSystemModuleStatus();
    dms.mockAllApi();
    ruleTemplate.mockAllApi();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render form snap when current projectID is undefined', async () => {
    const requestRuleTemplateTip = ruleTemplate.getProjectRuleTemplateTips();
    const requestProjectRuleTemplateTips = ruleTemplate.getRuleTemplateTips();
    customRender();
    expect(getProjectListSpy).toHaveBeenCalledTimes(1);
    expect(requestProjectRuleTemplateTips).toHaveBeenCalledTimes(1);
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(requestRuleTemplateTip).toHaveBeenCalledTimes(1);
    expect(getBySelector('#project')).toBeDisabled();

    cleanup();
    mockUseCurrentProject({ projectID: undefined });
    const { baseElement } = customRender();
    expect(getProjectListSpy).toHaveBeenCalledTimes(2);
    expect(requestProjectRuleTemplateTips).toHaveBeenCalledTimes(2);
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(requestRuleTemplateTip).toHaveBeenCalledTimes(1);
    const projectEle = getBySelector('#project');
    expect(projectEle).not.toBeDisabled();
    expect(getBySelector('.editable-select-trigger')).toHaveClass(
      'editable-select-trigger-disabled'
    );
    fireEvent.mouseDown(projectEle, baseElement);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('test_project_1'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.editable-select-trigger')).not.toHaveClass(
      'editable-select-trigger-disabled'
    );
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(2);
    expect(requestRuleTemplateTip).toHaveBeenCalledTimes(2);
  });

  it('render update form snap', async () => {
    const { baseElement } = customRender({ isUpdate: true });

    expect(screen.getByText('编辑数据源')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render name rule', async () => {
    const { baseElement } = customRender();

    const nameEle = getBySelector('#name', baseElement);
    await act(async () => {
      fireEvent.change(nameEle, {
        target: { value: '*' }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();

    await act(async () => {
      fireEvent.change(nameEle, {
        target: {
          value:
            'test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render database type', async () => {
    const requestListDBServiceDriver = dms.getListDBServiceDriverOption();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));

    const typeEle = getBySelector('#type');
    fireEvent.mouseDown(typeEle, baseElement);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestListDBServiceDriver).toHaveBeenCalled();
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));

    const ruleTemplateName = getBySelector('#ruleTemplateName');
    const ruleTemplateId = getBySelector('#ruleTemplateId');
    expect(ruleTemplateName).toHaveAttribute('value', undefined);
    expect(ruleTemplateId).toHaveAttribute('value', undefined);
    expect(getSystemModuleStatusSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(2700));
    expect(screen.getByText('SQL备份配置')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render change switch when page is update', async () => {
    const singleData = { ...DBServicesList[0], db_type: 'mysql' };
    const { baseElement } = customRender({
      isUpdate: true,
      defaultData: singleData
    });

    const needUpdatePassword = getBySelector(
      '#needUpdatePassword',
      baseElement
    );
    fireEvent.change(needUpdatePassword, {
      target: {
        value: true
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    const needAuditForSqlQuery = getBySelector(
      '#needAuditForSqlQuery',
      baseElement
    );
    fireEvent.change(needAuditForSqlQuery, {
      target: {
        value: true
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    const allowQueryLevel = getBySelector(
      '#allowQueryWhenLessThanAuditLevel',
      baseElement
    );
    fireEvent.mouseDown(allowQueryLevel);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render cancel rule', async () => {
    const requestRuleTemplateTip = ruleTemplate.getProjectRuleTemplateTips();
    const requestProjectRuleTemplateTips = ruleTemplate.getRuleTemplateTips();
    const singleData = {
      ...DBServicesList[0],
      db_type: 'mysql',
      sqle_config: {
        ...DBServicesList[0].sqle_config,
        rule_template_id: '2',
        rule_template_name: 'custom_template_b'
      }
    };
    const { baseElement } = customRender({
      isUpdate: true,
      defaultData: singleData
    });

    await act(async () => jest.advanceTimersByTime(9300));
    expect(requestProjectRuleTemplateTips).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestRuleTemplateTip).toHaveBeenCalled();
    const ruleTemplateId = getBySelector('#ruleTemplateId', baseElement);
    expect(screen.getByText('custom_template_b')).toBeInTheDocument();
    expect(ruleTemplateId).toHaveAttribute(
      'value',
      singleData.sqle_config?.rule_template_id
    );

    const switchEle = getAllBySelector('.ant-switch', baseElement);
    expect(switchEle.length).toBe(5);
    expect(switchEle[1]).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(switchEle[1]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText(
        '如果不启用SQL审核业务，则在SQL审核相关业务中无法使用该数据源，是否确认关闭？'
      )
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('.ant-popconfirm-buttons .ant-btn-primary'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('reset form when projectID is not undefined', async () => {
    mockUseCurrentProject({ projectID: mockProjectList[0].uid });
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(mockProjectList[0].name!)).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    const environmentTagEle = getBySelector('.editable-select-trigger');
    fireEvent.click(environmentTagEle);
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));
    expect(environmentTagEle).toHaveTextContent('environment-1');

    await act(async () => {
      EventEmitter.emit(EmitterKey.DMS_Reset_DataSource_Form);
      await jest.advanceTimersByTime(300);
    });
    expect(environmentTagEle).toHaveTextContent('environment-1');
    expect(screen.getByText(mockProjectList[0].name!)).toBeInTheDocument();
  });

  it('reset form when projectID is undefined', async () => {
    mockUseCurrentProject({ projectID: undefined });
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const projectEle = getBySelector('#project');
    fireEvent.mouseDown(projectEle);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('test_project_1'));
    await act(async () => jest.advanceTimersByTime(3000));

    const environmentTagEle = getBySelector('.editable-select-trigger');
    fireEvent.click(environmentTagEle);
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));
    expect(environmentTagEle).toHaveTextContent('environment-1');
    await act(async () => {
      EventEmitter.emit(EmitterKey.DMS_Reset_DataSource_Form);
      await jest.advanceTimersByTime(300);
    });
    expect(screen.queryByText('environment-1')).not.toBeInTheDocument();
    expect(screen.queryByText('test_project_1')).not.toBeInTheDocument();
  });
});

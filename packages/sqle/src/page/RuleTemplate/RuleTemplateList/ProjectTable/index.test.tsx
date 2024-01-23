import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import ProjectTable from '.';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import rule_template from '../../../../testUtils/mockApi/rule_template';
import { projectRuleTemplateListMockData } from '../../../../testUtils/mockApi/rule_template/data';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import { ModalName } from '../../../../data/ModalName';
import { useDispatch, useSelector } from 'react-redux';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  queryBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('sqle/RuleTemplate/List/ProjectTable', () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();
  const templateName = projectRuleTemplateListMockData[0].rule_template_name;
  let getProjectRuleTemplateListSpy: jest.SpyInstance;
  let mockUseCurrentProjectSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProjectSpy = mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        ruleTemplate: {
          modalStatus: { [ModalName.Clone_Rule_Template]: false }
        }
      })
    );
    getProjectRuleTemplateListSpy = rule_template.getProjectRuleTemplateList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (actionPermission?: boolean) =>
    renderWithReduxAndTheme(
      <BrowserRouter>
        <ProjectTable actionPermission={actionPermission} />
      </BrowserRouter>
    );

  it('render project rule template list when actionPermission is falsy', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getProjectRuleTemplateListSpy).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(`共 ${projectRuleTemplateListMockData.length} 条数据`)
    ).toBeInTheDocument();
    expect(screen.queryByText('编 辑')).not.toBeInTheDocument();
    expect(screen.queryByText('删 除')).not.toBeInTheDocument();
  });

  it('render project rule template list when actionPermission is true', async () => {
    const { baseElement } = customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getProjectRuleTemplateListSpy).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    const length = projectRuleTemplateListMockData.length;
    expect(screen.getByText(`共 ${length} 条数据`)).toBeInTheDocument();
    expect(screen.getAllByText('编 辑')).toHaveLength(length);
    expect(screen.getAllByText('删 除')).toHaveLength(length);
  });

  it('render project rule template list when projectArchive is true', async () => {
    mockUseCurrentProjectSpy.mockClear();
    mockUseCurrentProjectSpy.mockImplementation(() => ({
      ...mockProjectInfo,
      projectArchive: true
    }));
    const { baseElement } = customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getProjectRuleTemplateListSpy).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    const length = projectRuleTemplateListMockData.length;
    expect(screen.getByText(`共 ${length} 条数据`)).toBeInTheDocument();
    expect(screen.queryByText('编 辑')).not.toBeInTheDocument();
    expect(screen.queryByText('删 除')).not.toBeInTheDocument();
    expect(screen.getAllByText('导 出')).toHaveLength(length);
    expect(screen.getAllByText('克 隆')).toHaveLength(length);
  });

  it('should render empty tips when request not success', async () => {
    getProjectRuleTemplateListSpy.mockClear();
    getProjectRuleTemplateListSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { baseElement } = customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    const element = queryBySelector('.ant-table-placeholder', baseElement);
    expect(element).toBeInTheDocument();
  });

  it('should refresh table when emit "Refresh_Rule_Template_List" event', async () => {
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getProjectRuleTemplateListSpy).toBeCalledTimes(1);
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Rule_Template_List)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getProjectRuleTemplateListSpy).toBeCalledTimes(2);
  });

  it('click edit button', async () => {
    getProjectRuleTemplateListSpy.mockClear();
    getProjectRuleTemplateListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [projectRuleTemplateListMockData[0]] })
    );
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toBeCalledTimes(1);
  });

  it('click delete button', async () => {
    getProjectRuleTemplateListSpy.mockClear();
    getProjectRuleTemplateListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [projectRuleTemplateListMockData[0]] })
    );
    const deleteProjectRuleTemplateSpy =
      rule_template.deleteProjectRuleTemplate();
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText(`确认要删除规则模版"${templateName}"么?`)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.getByText(`正在删除模版 "${templateName}"...`)
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(
      screen.getByText(`删除模版"${templateName}"成功`)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`正在删除模版 "${templateName}"...`)
    ).not.toBeInTheDocument();
    expect(deleteProjectRuleTemplateSpy).toBeCalledTimes(1);
    expect(deleteProjectRuleTemplateSpy).toBeCalledWith({
      rule_template_name: projectRuleTemplateListMockData[0].rule_template_name,
      project_name: mockProjectInfo.projectName
    });
  });

  it('click export button', async () => {
    getProjectRuleTemplateListSpy.mockClear();
    getProjectRuleTemplateListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [projectRuleTemplateListMockData[0]] })
    );
    const exportProjectRuleTemplateSpy =
      rule_template.exportProjectRuleTemplate();
    const { baseElement } = customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(
      getBySelector('.actiontech-table-actions-more-button', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('导出规则模板')).toBeInTheDocument();
    fireEvent.click(screen.getByText('导出规则模板'));
    await act(async () => jest.advanceTimersByTime(100));

    expect(
      screen.getByText(`正在导出模版 "${templateName}"...`)
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText(`导出模版"${templateName}"成功`)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`正在导出模版 "${templateName}"...`)
    ).not.toBeInTheDocument();
    expect(exportProjectRuleTemplateSpy).toBeCalledTimes(1);
    expect(exportProjectRuleTemplateSpy).toBeCalledWith(
      {
        rule_template_name:
          projectRuleTemplateListMockData[0].rule_template_name,
        project_name: mockProjectInfo.projectName
      },
      {
        responseType: 'blob'
      }
    );
  });

  it('click clone button', async () => {
    getProjectRuleTemplateListSpy.mockClear();
    getProjectRuleTemplateListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [projectRuleTemplateListMockData[0]] })
    );
    const { baseElement } = customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: {
        modalStatus: {
          [ModalName.Clone_Rule_Template]: false
        }
      },
      type: 'ruleTemplate/initModalStatus'
    });
    fireEvent.click(
      getBySelector('.actiontech-table-actions-more-button', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('克隆规则模版')).toBeInTheDocument();
    fireEvent.click(screen.getByText('克隆规则模版'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(dispatchSpy).toBeCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      payload: {
        ruleTemplate: projectRuleTemplateListMockData[0]
      },
      type: 'ruleTemplate/updateSelectRuleTemplate'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      payload: {
        modalName: ModalName.Clone_Rule_Template,
        status: true
      },
      type: 'ruleTemplate/updateModalStatus'
    });
  });

  it('click export button when isAdmin when projectArchive is true', async () => {
    getProjectRuleTemplateListSpy.mockClear();
    getProjectRuleTemplateListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [projectRuleTemplateListMockData[0]] })
    );
    mockUseCurrentProjectSpy.mockClear();
    mockUseCurrentProjectSpy.mockImplementation(() => ({
      ...mockProjectInfo,
      projectArchive: true
    }));
    const exportProjectRuleTemplateSpy =
      rule_template.exportProjectRuleTemplate();
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('导 出')).toBeInTheDocument();
    fireEvent.click(screen.getByText('导 出'));
    await act(async () => jest.advanceTimersByTime(100));

    expect(
      screen.getByText(`正在导出模版 "${templateName}"...`)
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText(`导出模版"${templateName}"成功`)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`正在导出模版 "${templateName}"...`)
    ).not.toBeInTheDocument();
    expect(exportProjectRuleTemplateSpy).toBeCalledTimes(1);
    expect(exportProjectRuleTemplateSpy).toBeCalledWith(
      {
        rule_template_name:
          projectRuleTemplateListMockData[0].rule_template_name,
        project_name: mockProjectInfo.projectName
      },
      {
        responseType: 'blob'
      }
    );
  });

  it('click clone button when projectArchive is true', async () => {
    getProjectRuleTemplateListSpy.mockClear();
    getProjectRuleTemplateListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [projectRuleTemplateListMockData[0]] })
    );
    mockUseCurrentProjectSpy.mockClear();
    mockUseCurrentProjectSpy.mockImplementation(() => ({
      ...mockProjectInfo,
      projectArchive: true
    }));
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: {
        modalStatus: {
          [ModalName.Clone_Rule_Template]: false
        }
      },
      type: 'ruleTemplate/initModalStatus'
    });
    expect(screen.getByText('克 隆')).toBeInTheDocument();
    fireEvent.click(screen.getByText('克 隆'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(dispatchSpy).toBeCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      payload: {
        ruleTemplate: projectRuleTemplateListMockData[0]
      },
      type: 'ruleTemplate/updateSelectRuleTemplate'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      payload: {
        modalName: ModalName.Clone_Rule_Template,
        status: true
      },
      type: 'ruleTemplate/updateModalStatus'
    });
  });
});

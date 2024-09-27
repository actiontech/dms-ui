import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import RuleTemplateList from '.';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import rule_template from '../../../testUtils/mockApi/rule_template';
import { publicRuleTemplateListMockData } from '../../../testUtils/mockApi/rule_template/data';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import { ModalName } from '../../../data/ModalName';
import { useDispatch, useSelector } from 'react-redux';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  queryBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';

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

describe('sqle/GlobalRuleTemplate/RuleTemplateList', () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();
  const templateName = publicRuleTemplateListMockData[0].rule_template_name;
  let getRuleTemplateListSpy: jest.SpyInstance;
  let mockUseCurrentUserSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUserSpy = mockUseCurrentUser();
    mockUseDbServiceDriver();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        globalRuleTemplate: {
          modalStatus: { [ModalName.Clone_Rule_Template]: false },
          activeSegmentedKey: RuleManagerSegmentedKey.GlobalRuleTemplate
        }
      })
    );
    getRuleTemplateListSpy = rule_template.getRuleTemplateList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (hiddenOperations = false) =>
    renderWithReduxAndTheme(
      <BrowserRouter>
        <RuleTemplateList hiddenOperations={hiddenOperations} />
      </BrowserRouter>
    );

  it('render rule template list when hiddenOperations is falsy', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRuleTemplateListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(`共 ${publicRuleTemplateListMockData.length} 条数据`)
    ).toBeInTheDocument();
    expect(screen.getAllByText('编 辑')).toHaveLength(3);
    expect(screen.getAllByText('删 除')).toHaveLength(3);
  });

  it('render rule template list when hiddenOperations is true', async () => {
    const { baseElement } = customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRuleTemplateListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    const length = publicRuleTemplateListMockData.length;
    expect(screen.getByText(`共 ${length} 条数据`)).toBeInTheDocument();
    expect(screen.queryByText('编 辑')).not.toBeInTheDocument();
    expect(screen.queryByText('删 除')).not.toBeInTheDocument();
  });

  it('render rule template list when isAdmin is false', async () => {
    mockUseCurrentUserSpy.mockClear();
    mockUseCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      isAdmin: false
    }));
    customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRuleTemplateListSpy).toHaveBeenCalledTimes(1);
    const length = publicRuleTemplateListMockData.length;
    expect(screen.getByText(`共 ${length} 条数据`)).toBeInTheDocument();
    expect(screen.queryByText('编 辑')).not.toBeInTheDocument();
    expect(screen.queryByText('删 除')).not.toBeInTheDocument();
  });

  it('should render empty tips when request not success', async () => {
    getRuleTemplateListSpy.mockClear();
    getRuleTemplateListSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { baseElement } = customRender(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    const element = queryBySelector('.ant-table-placeholder', baseElement);
    expect(element).toBeInTheDocument();
  });

  it('should refresh table when emit "Refresh_Global_Rule_Template_List" event', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRuleTemplateListSpy).toHaveBeenCalledTimes(1);
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Global_Rule_Template_List)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRuleTemplateListSpy).toHaveBeenCalledTimes(2);
  });

  it('click edit button', async () => {
    getRuleTemplateListSpy.mockClear();
    getRuleTemplateListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [publicRuleTemplateListMockData[0]] })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('click delete button', async () => {
    getRuleTemplateListSpy.mockClear();
    getRuleTemplateListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [publicRuleTemplateListMockData[0]] })
    );
    const deleteRuleTemplateSpy = rule_template.deleteRuleTemplate();
    customRender();
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
    expect(deleteRuleTemplateSpy).toHaveBeenCalledTimes(1);
    expect(deleteRuleTemplateSpy).toHaveBeenCalledWith({
      rule_template_name: publicRuleTemplateListMockData[0].rule_template_name
    });
  });

  it('click export button', async () => {
    getRuleTemplateListSpy.mockClear();
    getRuleTemplateListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [publicRuleTemplateListMockData[0]] })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: {
        modalStatus: {
          [ModalName.Clone_Rule_Template]: false,
          [ModalName.Export_Rule_Template]: false
        }
      },
      type: 'globalRuleTemplate/initModalStatus'
    });
    fireEvent.click(
      getBySelector('.actiontech-table-actions-more-button', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('导出规则模板')).toBeInTheDocument();
    fireEvent.click(screen.getByText('导出规则模板'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      payload: {
        ruleTemplate: publicRuleTemplateListMockData[0]
      },
      type: 'globalRuleTemplate/updateGlobalSelectRuleTemplate'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      payload: {
        modalName: ModalName.Export_Rule_Template,
        status: true
      },
      type: 'globalRuleTemplate/updateModalStatus'
    });
  });

  it('click clone button', async () => {
    getRuleTemplateListSpy.mockClear();
    getRuleTemplateListSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [publicRuleTemplateListMockData[0]] })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: {
        modalStatus: {
          [ModalName.Clone_Rule_Template]: false,
          [ModalName.Export_Rule_Template]: false
        }
      },
      type: 'globalRuleTemplate/initModalStatus'
    });
    fireEvent.click(
      getBySelector('.actiontech-table-actions-more-button', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('克隆规则模版')).toBeInTheDocument();
    fireEvent.click(screen.getByText('克隆规则模版'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      payload: {
        ruleTemplate: publicRuleTemplateListMockData[0]
      },
      type: 'globalRuleTemplate/updateGlobalSelectRuleTemplate'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      payload: {
        modalName: ModalName.Clone_Rule_Template,
        status: true
      },
      type: 'globalRuleTemplate/updateModalStatus'
    });
  });
});

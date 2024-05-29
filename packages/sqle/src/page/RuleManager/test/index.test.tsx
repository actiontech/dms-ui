import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import RuleManager from '..';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import rule_template from '../../../testUtils/mockApi/rule_template';
import { publicRuleTemplateListMockData } from '../../../testUtils/mockApi/rule_template/data';
import { useNavigate, BrowserRouter } from 'react-router-dom';
import { ModalName } from '../../../data/ModalName';
import { useDispatch, useSelector } from 'react-redux';
import { RuleManagerSegmentedKey } from '../index.type';
import { mockDriver } from '../../../testUtils/mockRequest';
import { mockUseCurrentPermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentPermission';

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

describe('sqle/RuleManager', () => {
  const navigateSpy = jest.fn();
  const dispatchSpy = jest.fn();
  let getRuleTemplateListSpy: jest.SpyInstance;
  let mockUseCurrentUserSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentPermission();
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

  const customRender = () =>
    renderWithReduxAndTheme(
      <BrowserRouter>
        <RuleManager />
      </BrowserRouter>
    );

  it('should render global rule template list list when it first entered the page', async () => {
    const { baseElement } = customRender();
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(getRuleTemplateListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(`共 ${publicRuleTemplateListMockData.length} 条数据`)
    ).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(
      getBySelector('.ant-segmented-group', baseElement)
    ).toBeInTheDocument();
    expect(screen.getByText('导入规则模板')).toBeInTheDocument();
    expect(screen.getByText('创建规则模版')).toBeInTheDocument();
    fireEvent.click(screen.getByText('导入规则模板'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalled();
    fireEvent.click(screen.getByText('创建规则模版'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('click refresh icon', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender();

    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRuleTemplateListSpy).toHaveBeenCalledTimes(2);
    expect(eventEmitSpy).toHaveBeenCalledTimes(2);
    expect(eventEmitSpy).toHaveBeenNthCalledWith(
      1,
      EmitterKey.Refresh_Global_Rule_Template_List
    );
    expect(eventEmitSpy).toHaveBeenNthCalledWith(
      2,
      EmitterKey.Refresh_Custom_Rule_Template_List
    );
  });

  it('should render custom rule list', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        globalRuleTemplate: {
          modalStatus: { [ModalName.Clone_Rule_Template]: false },
          activeSegmentedKey: RuleManagerSegmentedKey.CustomRule
        }
      })
    );
    const getCustomRulesSpy = rule_template.getCustomRules();
    mockDriver();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('自定义规则'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(getCustomRulesSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('新 建')).toBeInTheDocument();
    fireEvent.click(screen.getByText('新 建'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalled();
  });
});

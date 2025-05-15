import { cleanup, screen, act } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import CommonTable from '.';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import rule_template from '../../../../testUtils/mockApi/rule_template';
import { publicRuleTemplateListMockData } from '../../../../testUtils/mockApi/rule_template/data';
import { BrowserRouter } from 'react-router-dom';
import { createSpyErrorResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/RuleTemplate/List/CommonTable', () => {
  let getRuleTemplateListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    getRuleTemplateListSpy = rule_template.getRuleTemplateList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = () =>
    superRender(
      <BrowserRouter>
        <CommonTable />
      </BrowserRouter>
    );

  it('render common rule template list', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRuleTemplateListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(`共 ${publicRuleTemplateListMockData.length} 条数据`)
    ).toBeInTheDocument();
  });

  it('should render empty tips when request not success', async () => {
    getRuleTemplateListSpy.mockClear();
    getRuleTemplateListSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    const element = queryBySelector('.ant-table-placeholder', baseElement);
    expect(element).toBeInTheDocument();
  });

  it('should refresh table when emit "Refresh_Rule_Template_List" event', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRuleTemplateListSpy).toHaveBeenCalledTimes(1);
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Rule_Template_List)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRuleTemplateListSpy).toHaveBeenCalledTimes(2);
  });
});

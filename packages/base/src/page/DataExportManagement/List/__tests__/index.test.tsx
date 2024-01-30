import userCenter from '../../../../testUtils/mockApi/userCenter';
import dbServices from '../../../../testUtils/mockApi/dbServices';
import dataExport from '../../../../testUtils/mockApi/dataExport';
import { superRender } from '../../../../testUtils/customRender';
import ExportWorkflowList from '..';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => {
  return {
    useNavigate: jest.fn(),
    ...jest.requireActual('react-router-dom')
  };
});

describe('test base/DataExport/List', () => {
  let dbServiceTipsSpy: jest.SpyInstance;
  let exportWorkflowListSpy: jest.SpyInstance;
  let memberTipsSpy: jest.SpyInstance;
  let navigateSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    memberTipsSpy = userCenter.getMemberTips();
    dbServiceTipsSpy = dbServices.ListDBServicesTips();
    exportWorkflowListSpy = dataExport.ListDataExportWorkflows();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', () => {
    const { container } = superRender(<ExportWorkflowList />);

    expect(container).toMatchSnapshot();
  });
});

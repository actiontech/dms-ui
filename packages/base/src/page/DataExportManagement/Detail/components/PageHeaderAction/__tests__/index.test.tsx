import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  mockActionButtonStateData,
  mockUseActionButtonState
} from '../../../testUtils/mockUseActionButtonState';
import { baseSuperRender } from '../../../../../../testUtils/superRender';
import ExportDetailPageHeaderAction from '..';
import {
  mockDataExportDetailRedux,
  mockUseDataExportDetailReduxManage
} from '../../../testUtils/mockUseDataExportDetailReduxManage';
import { fireEvent, screen } from '@testing-library/react';

describe('test base/DataExport/Detail/PageHeaderAction', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseActionButtonState();
    mockUseDataExportDetailReduxManage();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', () => {
    const { container } = baseSuperRender(<ExportDetailPageHeaderAction />);
    expect(container).toMatchSnapshot();
  });

  it('clicked workflow detail button', () => {
    const { container } = baseSuperRender(<ExportDetailPageHeaderAction />);
    fireEvent.click(screen.getByText('工单详情'));
    expect(
      mockDataExportDetailRedux.updateWorkflowStepOpen
    ).toHaveBeenCalledTimes(1);
    expect(
      mockDataExportDetailRedux.updateWorkflowStepOpen
    ).toHaveBeenCalledWith(true);
    expect(container).toMatchSnapshot();
  });

  it('clicked close workflow button', () => {
    baseSuperRender(<ExportDetailPageHeaderAction />);
    fireEvent.click(screen.getByText('关闭工单'));
    expect(
      mockActionButtonStateData.closeWorkflowButtonMeta.action
    ).toHaveBeenCalledTimes(1);
  });

  it('clicked approve workflow button', () => {
    baseSuperRender(<ExportDetailPageHeaderAction />);
    fireEvent.click(screen.getByText('审核通过'));
    expect(
      mockActionButtonStateData.approveWorkflowButtonMeta.action
    ).toHaveBeenCalledTimes(1);
  });

  it('clicked rejected workflow button', () => {
    baseSuperRender(<ExportDetailPageHeaderAction />);
    fireEvent.click(screen.getByText('审核驳回'));
    expect(
      mockActionButtonStateData.rejectWorkflowButtonMeta.action
    ).toHaveBeenCalledTimes(1);
  });

  it('clicked execute export workflow button', () => {
    baseSuperRender(<ExportDetailPageHeaderAction />);
    fireEvent.click(screen.getByText('执行导出'));
    expect(
      screen.queryByText(
        '当前操作将立即执行导出工单下的所有任务，是否确认立即执行导出?'
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    expect(
      mockActionButtonStateData.executeExportButtonMeta.action
    ).toHaveBeenCalledTimes(1);
  });
});

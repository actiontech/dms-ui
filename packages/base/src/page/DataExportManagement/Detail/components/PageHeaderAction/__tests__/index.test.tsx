import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  mockActionButtonStateData,
  mockUseActionButtonState
} from '../../../testUtils/mockUseActionButtonState';
import { superRender } from '../../../../../../testUtils/customRender';
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
    const { container } = superRender(<ExportDetailPageHeaderAction />);
    expect(container).toMatchSnapshot();
  });

  it('clicked workflow detail button', () => {
    const { container } = superRender(<ExportDetailPageHeaderAction />);
    fireEvent.click(screen.getByText('工单详情'));
    expect(mockDataExportDetailRedux.updateWorkflowStepOpen).toBeCalledTimes(1);
    expect(mockDataExportDetailRedux.updateWorkflowStepOpen).toBeCalledWith(
      true
    );
    expect(container).toMatchSnapshot();
  });

  it('clicked close workflow button', () => {
    superRender(<ExportDetailPageHeaderAction />);
    fireEvent.click(screen.getByText('关闭工单'));
    expect(
      mockActionButtonStateData.closeWorkflowButtonMeta.action
    ).toBeCalledTimes(1);
  });

  it('clicked approve workflow button', () => {
    superRender(<ExportDetailPageHeaderAction />);
    fireEvent.click(screen.getByText('审核通过'));
    expect(
      mockActionButtonStateData.approveWorkflowButtonMeta.action
    ).toBeCalledTimes(1);
  });

  it('clicked rejected workflow button', () => {
    superRender(<ExportDetailPageHeaderAction />);
    fireEvent.click(screen.getByText('审核驳回'));
    expect(
      mockActionButtonStateData.rejectWorkflowButtonMeta.action
    ).toBeCalledTimes(1);
  });

  it('clicked execute export workflow button', () => {
    superRender(<ExportDetailPageHeaderAction />);
    fireEvent.click(screen.getByText('执行导出'));
    expect(
      screen.queryByText(
        '当前操作将立即执行导出工单下的所有任务，是否确认立即执行导出?'
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    expect(
      mockActionButtonStateData.executeExportButtonMeta.action
    ).toBeCalledTimes(1);
  });
});

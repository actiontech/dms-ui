import { fireEvent } from '@testing-library/react';
import WorkflowRecordInfo from '..';
import { superRender } from '../../../../../../testUtils/customRender';
import {
  mockDataExportDetailRedux,
  mockUseDataExportDetailReduxManage
} from '../../../testUtils/mockUseDataExportDetailReduxManage';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

// 暂时先只匹配快照，页面逻辑等后续添加流程模板后再补充
describe('test base/DataExport/Detail/WorkflowRecordInfo', () => {
  beforeEach(() => {
    mockUseDataExportDetailReduxManage();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', () => {
    const { container } = superRender(<WorkflowRecordInfo />);
    expect(container).toMatchSnapshot();

    fireEvent.click(getBySelector('.custom-icon-close'));
    expect(mockDataExportDetailRedux.updateWorkflowStepOpen).toBeCalledTimes(1);
    expect(mockDataExportDetailRedux.updateWorkflowStepOpen).toBeCalledWith(
      false
    );
  });
});

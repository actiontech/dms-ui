import { useParams } from 'react-router-dom';
import dataExport from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport';
import {
  mockDataExportDetailRedux,
  mockUseDataExportDetailReduxManage
} from '../testUtils/mockUseDataExportDetailReduxManage';
import { baseSuperRender } from '../../../../testUtils/superRender';
import WorkflowDetail from '..';
import { act, fireEvent, screen } from '@testing-library/react';
import { GetDataExportWorkflowResponseData } from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport/data';
import {
  WorkflowRecordStatusEnum,
  WorkflowStepStateEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
  };
});

describe('test base/DataExport/Detail', () => {
  const workflowID = '1001';

  const useParamsMock: jest.Mock = useParams as jest.Mock;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseDataExportDetailReduxManage();
    dataExport.GetDataExportWorkflow();
    dataExport.BatchGetDataExportTask();
    dataExport.ListDataExportTaskSQLs();
    useParamsMock.mockReturnValue({ workflowID });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', async () => {
    const { baseElement } = baseSuperRender(<WorkflowDetail />);
    expect(baseElement).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('工单详情'));
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot with reject workflow', async () => {
    const rejectWorkflowData = {
      ...GetDataExportWorkflowResponseData,
      workflow_record: {
        ...GetDataExportWorkflowResponseData.workflow_record,
        status: WorkflowRecordStatusEnum.rejected,
        workflow_step_list: [
          {
            number: 1,
            type: '',
            assignee_user_list: [
              {
                uid: '700200',
                name: 'admin'
              }
            ],
            operation_user: {
              uid: '700200',
              name: 'admin'
            },
            operation_time: '2024-01-30T11:32:12.271+08:00',
            state: WorkflowStepStateEnum.rejected
          }
        ]
      }
    };
    mockUseDataExportDetailReduxManage({ workflowInfo: rejectWorkflowData });

    const { baseElement } = baseSuperRender(<WorkflowDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.queryByText(
        '当工单被驳回时，工单创建者需要对其进行修改，然后重新提交审核。（目前暂不支持修改工单。）'
      )
    ).toBeInTheDocument();
  });

  it('should executed clearAllDetailState when unmount component', () => {
    const { unmount } = baseSuperRender(<WorkflowDetail />);
    unmount();
    expect(mockDataExportDetailRedux.clearAllDetailState).toHaveBeenCalledTimes(
      1
    );
  });
});

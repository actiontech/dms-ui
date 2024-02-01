import { WorkflowStepStateEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import RejectReason from '.';
import { superRender } from '../../../../../testUtils/customRender';

describe('test base/DataExport/Detail/RejectReason', () => {
  it('should match snapshot', () => {
    const { container } = superRender(
      <RejectReason
        stepInfo={{
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
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });
});

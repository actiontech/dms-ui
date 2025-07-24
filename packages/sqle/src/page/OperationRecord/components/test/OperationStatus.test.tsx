import OperationStatus from '../OperationStatus';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { OperationRecordListStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('sqle/OperationRecord/OperationStatus', () => {
  it('should match snap shot', () => {
    const { baseElement } = superRender(
      <OperationStatus status={OperationRecordListStatusEnum.failed} />
    );
    const { baseElement: baseElement2 } = superRender(
      <OperationStatus status={OperationRecordListStatusEnum.succeeded} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(baseElement2).toMatchSnapshot();
  });
});

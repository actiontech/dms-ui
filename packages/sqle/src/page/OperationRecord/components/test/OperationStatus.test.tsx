import OperationStatus from '../OperationStatus';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { OperationRecordListItemStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

describe('sqle/OperationRecord/OperationStatus', () => {
  it('should match snap shot', () => {
    const { baseElement } = superRender(
      <OperationStatus status={OperationRecordListItemStatusEnum.failed} />
    );
    const { baseElement: baseElement2 } = superRender(
      <OperationStatus status={OperationRecordListItemStatusEnum.succeeded} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(baseElement2).toMatchSnapshot();
  });
});

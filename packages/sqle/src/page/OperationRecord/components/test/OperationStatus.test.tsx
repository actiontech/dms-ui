import OperationStatus from '../OperationStatus';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { OperationRecordListStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('sqle/OperationRecord/OperationStatus', () => {
  it('should match snap shot', () => {
    const { baseElement } = renderWithReduxAndTheme(
      <OperationStatus status={OperationRecordListStatusEnum.failed} />
    );
    const { baseElement: baseElement2 } = renderWithReduxAndTheme(
      <OperationStatus status={OperationRecordListStatusEnum.succeeded} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(baseElement2).toMatchSnapshot();
  });
});

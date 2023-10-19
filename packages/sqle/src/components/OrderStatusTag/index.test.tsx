import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import OrderStatusTag from '.';
import { render } from '@testing-library/react';

describe('OrderStatusTag', () => {
  test('should render username by redux state', () => {
    const { container, rerender } = render(<OrderStatusTag />);
    expect(container).toMatchSnapshot();
    rerender(
      <OrderStatusTag status={WorkflowRecordResV2StatusEnum.canceled} />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <OrderStatusTag status={WorkflowRecordResV2StatusEnum.finished} />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <OrderStatusTag status={WorkflowRecordResV2StatusEnum.wait_for_audit} />
    );
    expect(container).toMatchSnapshot();
    rerender(
      <OrderStatusTag
        status={WorkflowRecordResV2StatusEnum.wait_for_execution}
      />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <OrderStatusTag status={WorkflowRecordResV2StatusEnum.rejected} />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <OrderStatusTag status={WorkflowRecordResV2StatusEnum.exec_failed} />
    );
    expect(container).toMatchSnapshot();

    rerender(
      <OrderStatusTag status={WorkflowRecordResV2StatusEnum.executing} />
    );
    expect(container).toMatchSnapshot();
  });
});

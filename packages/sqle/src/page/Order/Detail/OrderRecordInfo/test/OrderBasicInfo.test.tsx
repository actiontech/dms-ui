import { cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../../../../testUtils/customRender';

import OrderBasicInfo from '../OrderBasicInfo';
import { OrderBasicInfoProps } from '../index.type';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('sqle/Order/Detail/OrderBasicInfo', () => {
  const customRender = (orderStatus?: WorkflowRecordResV2StatusEnum) => {
    const params: OrderBasicInfoProps = {
      createTime: '2024-01-05T11:00:33Z',
      createUserName: 'admin'
    };
    return renderWithTheme(
      <OrderBasicInfo {...params} orderStatus={orderStatus} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap when order is undefined', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when order is normal', () => {
    const { baseElement } = customRender(
      WorkflowRecordResV2StatusEnum.executing
    );
    expect(baseElement).toMatchSnapshot();
  });
});

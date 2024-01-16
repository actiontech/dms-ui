import { OrderDetailPageHeaderExtraProps } from '../index.type';
import OrderDetailPageHeaderExtra from '..';

import { cleanup, fireEvent, act } from '@testing-library/react';
import { renderWithTheme } from '../../../../../testUtils/customRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('sqle/Order/Detail/OrderDetailPageHeaderExtra', () => {
  const customRender = (params: OrderDetailPageHeaderExtraProps) => {
    return renderWithTheme(
      <OrderDetailPageHeaderExtra {...params} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap', () => {
    const { baseElement } = customRender({
      projectName: 'project name'
    });
  })
});

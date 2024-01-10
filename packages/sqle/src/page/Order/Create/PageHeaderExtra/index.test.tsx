
import { renderWithTheme } from '../../../../testUtils/customRender';

import OrderPageHeaderExtra from '.';
import { OrderPageHeaderExtraProps } from './index.type';

describe('sqle/Order/Create/PageHeaderExtra', () => {
  const resetAllFormFn = jest.fn();
  const openEditSQLInfoDrawerFn = jest.fn();
  const createFn = jest.fn();

  const customRender = (paramsIn: Partial<OrderPageHeaderExtraProps> = {}) => {
    const params: OrderPageHeaderExtraProps = {
      showCreateOrderForm: true,
      createdResultVisibility: false,
      createLoading: false,
      auditLoading: false,
      resetAllForm: resetAllFormFn,
      openEditSQLInfoDrawer: openEditSQLInfoDrawerFn,
      isDisableFinallySubmitButton: false,
      disabledOperatorOrderBtnTips: '',
      create: createFn
    };
    return renderWithTheme(<OrderPageHeaderExtra {...params} {...paramsIn} />);
  };

  it('render create title', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render when it is created result', () => {
    const { baseElement } = customRender({
      createdResultVisibility: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render when is not created', () => {
    const { baseElement } = customRender({
      showCreateOrderForm: false,
      createdResultVisibility: false,
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render when is not created and createLoading', () => {
    const { baseElement } = customRender({
      showCreateOrderForm: false,
      createdResultVisibility: false,
      createLoading: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render when is not created and is disabled finally', () => {
    const { baseElement } = customRender({
      showCreateOrderForm: false,
      createdResultVisibility: false,
      isDisableFinallySubmitButton: true,
      disabledOperatorOrderBtnTips: 'it is a btn tip'
    });
    expect(baseElement).toMatchSnapshot();
  });
});

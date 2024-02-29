import { Form } from 'antd';
import { cleanup, screen } from '@testing-library/react';
import { renderWithTheme } from '../../../../testUtils/customRender';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

import { OrderBaseInfoFormFields } from './index.type';
import BaseInfoForm from '.';

describe('sqle/Order/CreateOrder/BaseInfoForm', () => {
  const customRender = () => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<OrderBaseInfoFormFields>()
    );
    return renderWithTheme(<BaseInfoForm form={result.current[0]} />);
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
    cleanup();
  });

  it('render snap BaseInfoForm', () => {
    const { baseElement } = customRender();
    expect(screen.getByText('创建工单')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});

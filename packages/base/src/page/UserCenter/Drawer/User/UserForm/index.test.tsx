import {
  superRender,
  superRenderHook
} from '@actiontech/shared/lib/testUtil/superRender';
import { Form } from 'antd';
import { IUserFormFields, IUserFormProps } from './index.type';
import UserForm from '.';
import { screen, fireEvent, act } from '@testing-library/react';

describe('base/UserCenter/Drawer/UserForm', () => {
  const customRender = (
    props?: Pick<IUserFormProps, 'isAdmin' | 'isUpdate'>
  ) => {
    const { result } = superRenderHook(() => Form.useForm<IUserFormFields>());
    const { baseElement } = superRender(
      <UserForm form={result.current[0]} visible={true} {...props} />
    );
    return baseElement;
  };
  it('should match snapshot when isUpdate is falsy', () => {
    const baseElement = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByLabelText('是否需要更新密码')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('是否禁用')).not.toBeInTheDocument();
  });

  it('should match snapshot when isUpdate is truthy', () => {
    const baseElement = customRender({ isUpdate: true });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByLabelText('是否需要更新密码')).toBeInTheDocument();
    expect(screen.getByLabelText('是否禁用')).toBeInTheDocument();
  });

  it('should match snapshot when isAdmin is truthy', () => {
    const baseElement = customRender({ isAdmin: true, isUpdate: true });
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByLabelText('是否禁用')).not.toBeInTheDocument();
  });

  it('should show error when username contains spaces', async () => {
    const { result } = superRenderHook(() => Form.useForm<IUserFormFields>());
    const form = result.current[0];

    superRender(<UserForm form={form} visible={true} />);

    const usernameInput = screen.getByPlaceholderText('请输入用户名');

    fireEvent.change(usernameInput, { target: { value: ' user name' } });

    await act(async () => {
      const error = await form.validateFields(['username']).catch((err) => err);

      expect(error.errorFields).toHaveLength(1);
      expect(error.errorFields[0].errors).toContain('用户名不支持首尾空格');
    });
  });
});

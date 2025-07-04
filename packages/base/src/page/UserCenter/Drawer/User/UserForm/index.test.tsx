import {
  superRender,
  superRenderHook
} from '@actiontech/shared/lib/testUtil/superRender';
import { Form } from 'antd';
import { IUserFormFields, IUserFormProps } from './index.type';
import UserForm from '.';
import { screen } from '@testing-library/react';

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
});

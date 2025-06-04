import {
  superRender,
  superRenderHook
} from '@actiontech/shared/lib/testUtil/superRender';
import RoleForm from '.';
import { Form } from 'antd';
import { screen } from '@testing-library/react';

describe('base/UserCenter/Drawer/Role/RoleForm', () => {
  const customRender = (isUpdate = false) => {
    const { result } = superRenderHook(() => Form.useForm());
    const { baseElement } = superRender(
      <RoleForm form={result.current[0]} visible={true} isUpdate={isUpdate} />
    );
    return baseElement;
  };
  it('should match snap shot when isUpdate is falsy', () => {
    const baseElement = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByLabelText('是否禁用')).not.toBeInTheDocument();
  });
  it('should match snap shot when isUpdate is truthy', () => {
    const baseElement = customRender(true);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByLabelText('是否禁用')).toBeInTheDocument();
  });
});

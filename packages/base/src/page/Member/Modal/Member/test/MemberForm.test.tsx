import {
  renderWithReduxAndTheme,
  renderHooksWithTheme
} from '@actiontech/shared/lib/testUtil/customRender';
import { Form } from 'antd';
import MemberForm from '../MemberForm';
import { screen } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { IMemberFormFields } from '../../index.type';

describe('base/Member/Modal/MemberForm', () => {
  const customRender = (isUpdate?: boolean) => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<IMemberFormFields>()
    );
    const { baseElement } = renderWithReduxAndTheme(
      <MemberForm
        form={result.current[0]}
        projectID={mockProjectInfo.projectID}
        isUpdate={isUpdate}
      />
    );
    return baseElement;
  };
  it('should match snapshot when isUpdate is falsy', () => {
    const baseElement = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when isUpdate is truthy', () => {
    const baseElement = customRender(true);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByLabelText('用户名称')).toBeDisabled();
  });
});

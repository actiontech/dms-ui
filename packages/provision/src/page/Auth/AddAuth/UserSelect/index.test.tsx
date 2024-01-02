import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import auth from '../../../../testUtil/mockApi/auth';

import UserSelect from '.';
import { UserSelectProps } from '../index.type';
import { Form } from 'antd';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('antd', () => {
  const actualAntd = jest.requireActual('antd');
  return {
    ...actualAntd,
    Form: {
      ...actualAntd.Form,
      useForm: jest.fn()
    }
  };
});

describe('page/Auth/AddAuth/UserSelect', () => {
  const projectID = mockProjectInfo.projectID;
  let updateUserListUserSpy: jest.SpyInstance;
  const customRender = (params: UserSelectProps) => {
    return superRender(
      <Form>
        <UserSelect {...params} />
      </Form>
    );
  };

  beforeEach(() => {
    mockUseCurrentProject();
    jest.useFakeTimers();
    updateUserListUserSpy = auth.listUsers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render user option api loading', async () => {
    const { baseElement } = customRender({
      className: 'is-custom-class'
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render user option when user api return data', async () => {
    customRender({
      className: 'is-custom-class'
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(updateUserListUserSpy).toBeCalled();
    expect(updateUserListUserSpy).toBeCalledWith({
      namespace_uid: projectID,
      page_index: 1,
      page_size: 999
    });
  });
});

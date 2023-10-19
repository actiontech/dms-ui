import { act, cleanup, renderHook } from '@testing-library/react';
import { Form } from 'antd';
import { superRender } from '~/testUtil/customRender';
import auth from '~/testUtil/mockApi/auth';
import UserSelect from '.';

describe('/AddAuth/UserSelect', () => {
  let listUsersSpy: jest.SpyInstance;
  beforeEach(() => {
    listUsersSpy = auth.listUsers();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('reset input value when popConfirm visible is false', async () => {
    const { result } = renderHook(() => Form.useForm());
    const { baseElement } = superRender(
      <Form form={result.current[0]}>
        <UserSelect form={result.current[0]} />
      </Form>
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});

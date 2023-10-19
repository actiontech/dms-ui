import { act, cleanup } from '@testing-library/react';
import userCenter from '../../../../testUtils/mockApi/userCenter';
import OpPermissionList from '.';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

describe('UserCenter/Role/OpPermissionList', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    userCenter.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  it('should render table', async () => {
    const { container } = renderWithTheme(<OpPermissionList />);
    await act(async () => jest.advanceTimersByTime(100));
    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});

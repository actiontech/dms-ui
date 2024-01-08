import { superRender } from '../../../../testUtils/customRender';
import UserAvatar from '.';
import { act, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('page/WorkflowTemplate/UserAvatar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  it('render user avatar', async () => {
    const { baseElement } = superRender(<UserAvatar data="admin" />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('A')).toBeInTheDocument();
    fireEvent.mouseOver(getBySelector('.ant-avatar'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('admin')).toBeInTheDocument();
  });
});

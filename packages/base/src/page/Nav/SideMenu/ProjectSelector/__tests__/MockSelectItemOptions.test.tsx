import { IBindProject } from '../index.type';
import MockSelectItemOptions from '../MockSelectItemOptions';

import { cleanup, fireEvent, screen, act } from '@testing-library/react';
import { baseSuperRender } from '../../../../../testUtils/superRender';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('base/page/Nav/SideMenu/MockSelectItemOptions', () => {
  const navigateSpy = jest.fn();
  const closeSelectDropdownFn = jest.fn();

  const customRender = (listData: IBindProject[] = []) => {
    return baseSuperRender(
      <MockSelectItemOptions
        list={listData}
        closeSelectDropdown={closeSelectDropdownFn}
      />
    );
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render snap when list is empty', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render snap when has list data', async () => {
    const { baseElement } = customRender([
      {
        archived: true,
        project_id: '1',
        project_name: 'test1'
      },
      {
        archived: false,
        project_id: '2',
        project_name: 'test2'
      }
    ]);
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('test1'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(`/sqle/project/1/overview`);
    expect(closeSelectDropdownFn).toHaveBeenCalled();

    fireEvent.mouseEnter(screen.getByText('test2'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseLeave(screen.getByText('test2'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});

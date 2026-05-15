import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import CardWrapper, { ICardWrapper } from '.';

import { sqleSuperRender } from '../../testUtils/superRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/components/CardWrapper', () => {
  const navigateSpy = jest.fn();

  const customRender = (params: ICardWrapper) => {
    return sqleSuperRender(<CardWrapper {...params} />);
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when enabledLoading is true', () => {
    const { baseElement } = customRender({
      title: 'is a title',
      enabledLoading: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click more link', async () => {
    const { baseElement } = customRender({
      title: 'a title',
      titleToolTips: 'a tips',
      extraNode: 'a extra',
      children: <span>this is a children</span>,
      moreRouteLink: {
        to: '/a'
      }
    });

    const moreLinkEle = getBySelector('.extra', baseElement);
    fireEvent.click(moreLinkEle);
    await act(async () => jest.advanceTimersByTime(300));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/a');

    const tipIcon = getBySelector('.icon-tip', baseElement);
    fireEvent.mouseOver(tipIcon);
    await act(async () => jest.advanceTimersByTime(500));
    expect(screen.getByText('a tips')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});

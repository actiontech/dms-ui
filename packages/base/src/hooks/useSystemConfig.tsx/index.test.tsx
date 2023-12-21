import {
  DMS_DEFAULT_WEB_LOGO_URL,
  DMS_DEFAULT_WEB_TITLE
} from '@actiontech/shared/lib/data/common';
import { useDispatch, useSelector } from 'react-redux';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import { renderHook } from '@testing-library/react-hooks';
import useSystemConfig from '.';
import { render } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));
describe('test base/hooks/useSystemConfig.tsx', () => {
  const scopeDispatch = jest.fn();

  beforeEach(() => {
    MockDate.set(dayjs('2023-12-18 12:00:00').valueOf());

    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        system: {
          webTitle: DMS_DEFAULT_WEB_TITLE
        }
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  it('render default web title and logo', () => {
    const { result } = renderHook(() => useSystemConfig());

    const { container } = render(<>{result.current.renderWebTitle()}</>);
    expect(container).toMatchSnapshot();

    expect(result.current.logoSrc).toBe(DMS_DEFAULT_WEB_LOGO_URL);
  });

  it('render custom web title', () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        system: {
          webTitle: 'test_web_title'
        }
      });
    });

    const { result } = renderHook(() => useSystemConfig());
    const { container } = render(<>{result.current.renderWebTitle()}</>);
    expect(container).toMatchSnapshot();
  });

  it('execute syncWebTitleAndLogo', () => {
    const mockedElement = {
      href: 'http://example.com'
    };
    document.getElementById = jest.fn().mockReturnValue(mockedElement);

    const { result } = renderHook(() => useSystemConfig());

    result.current.syncWebTitleAndLogo({
      title: 'custom title',
      logo_url: '/logo_custom.png'
    });
    expect(document.title).toBe('custom title');
    expect(mockedElement.href).toBe(
      `/logo_custom.png?temp=${dayjs('2023-12-18 12:00:00').valueOf()}`
    );

    expect(scopeDispatch).toBeCalledTimes(1);
    expect(scopeDispatch).nthCalledWith(1, {
      payload: {
        webLogoUrl: `/logo_custom.png?temp=${dayjs(
          '2023-12-18 12:00:00'
        ).valueOf()}`,
        webTitle: 'custom title'
      },
      type: 'system/updateWebTitleAndLogo'
    });

    result.current.syncWebTitleAndLogo({
      title: DMS_DEFAULT_WEB_TITLE
    });

    expect(document.title).toBe(DMS_DEFAULT_WEB_TITLE);
    expect(mockedElement.href).toBe(DMS_DEFAULT_WEB_LOGO_URL);

    expect(scopeDispatch).toBeCalledTimes(2);
    expect(scopeDispatch).nthCalledWith(2, {
      payload: {
        webLogoUrl: DMS_DEFAULT_WEB_LOGO_URL,
        webTitle: DMS_DEFAULT_WEB_TITLE
      },
      type: 'system/updateWebTitleAndLogo'
    });
  });
});

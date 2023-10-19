import {
  BrowserRouter,
  useNavigate as useOriginalNavigate
} from 'react-router-dom';
import { act, renderHook } from '@testing-library/react';
import useNavigate from './index';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});
describe('test useNavigate', () => {
  const navigateSpy = jest.fn();
  beforeEach(() => {
    (useOriginalNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should navigate to the right path without baseurl', async () => {
    const { result } = renderHook(() => useNavigate(), {
      wrapper: BrowserRouter
    });
    act(() => {
      result.current('/instance_manager');
    });
    expect(navigateSpy).toBeCalledWith('/instance_manager', undefined);
    navigateSpy.mockRestore();

    act(() => {
      result.current(123);
    });
    expect(navigateSpy).toBeCalledWith(123);
    navigateSpy.mockRestore();

    act(() => {
      result.current({
        pathname: '/user',
        search: '?user_name=Lucy',
        hash: '#index'
      });
    });
    expect(navigateSpy).toBeCalledWith(
      {
        pathname: '/user',
        search: '?user_name=Lucy',
        hash: '#index'
      },
      undefined
    );
  });

  test('should navigate to the right path with baseurl', async () => {
    const { result } = renderHook(() => useNavigate('/base'), {
      wrapper: BrowserRouter
    });
    act(() => {
      result.current('/instance_manager');
    });
    expect(navigateSpy).toBeCalledWith('/base/instance_manager', undefined);
    navigateSpy.mockRestore();

    act(() => {
      result.current('/base/data');
    });
    expect(navigateSpy).toBeCalledWith('/base/data', undefined);
    navigateSpy.mockRestore();

    act(() => {
      result.current({
        pathname: '/user',
        search: '?user_name=Lucy',
        hash: '#index'
      });
    });
    expect(navigateSpy).toBeCalledWith(
      {
        pathname: '/base/user',
        search: '?user_name=Lucy',
        hash: '#index'
      },
      undefined
    );
    navigateSpy.mockRestore();

    act(() => {
      result.current({
        pathname: '/base/user',
        search: '?user_name=Lucy',
        hash: '#index'
      });
    });
    expect(navigateSpy).toBeCalledWith(
      {
        pathname: '/base/user',
        search: '?user_name=Lucy',
        hash: '#index'
      },
      undefined
    );
  });
});

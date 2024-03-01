import { renderHook } from '@testing-library/react';
import useBack from '.';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('useBack', () => {
  test('should jump to last path in history when call goBack', () => {
    const navigateSpy = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    const { result } = renderHook(() => useBack());
    result.current.goBack();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });
});

import { useSelector } from 'react-redux';
import useCurrentPermission from '.';
import { cleanup } from '@testing-library/react';
import { renderHooksWithRedux } from '../../testUtil/customRender';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('hooks/useCurrentPermission', () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        permission: { sqlOptimizationIsSupported: false }
      });
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.useFakeTimers();
  });

  it('should return sqlOptimizationIsSupported', async () => {
    const { result } = renderHooksWithRedux(useCurrentPermission, {});
    expect(result.current.sqlOptimizationIsSupported).toEqual(false);
  });
});

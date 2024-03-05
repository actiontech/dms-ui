import auth from '../../testUtil/mockApi/auth';
import useListTipsByAuthKey from '.';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup } from '@testing-library/react';
import { tipsList } from '../../testUtil/mockApi/auth/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('provision/hooks/useListTipsByAuthKey', () => {
  let listTipsByAuthKeySpy: jest.SpyInstance;
  const tipOptions = tipsList.map((i) => ({ label: i, value: i }));
  beforeEach(() => {
    jest.useFakeTimers();
    listTipsByAuthKeySpy = auth.listTipsByAuthorizationKeyReq();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
    (console.error as jest.Mock).mockRestore();
  });

  it('should get tips data from request', async () => {
    const { result } = renderHooksWithRedux(useListTipsByAuthKey, {});

    expect(result.current.businessOptions).toBeUndefined();
    expect(result.current.purposeOptions).toBeUndefined();
    expect(result.current.serviceOptions).toBeUndefined();
    expect(listTipsByAuthKeySpy).toHaveBeenCalledTimes(3);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.businessOptions).toEqual(tipOptions);
    expect(result.current.purposeOptions).toEqual(tipOptions);
    expect(result.current.serviceOptions).toEqual(tipOptions);
  });

  it('should be undefined when response code is not equal success code', async () => {
    listTipsByAuthKeySpy.mockClear();
    listTipsByAuthKeySpy.mockImplementation(() =>
      createSpyFailResponse({ tips: [] })
    );

    const { result } = renderHooksWithRedux(() => useListTipsByAuthKey(), {});

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.businessOptions).toBeUndefined();
    expect(result.current.purposeOptions).toBeUndefined();
    expect(result.current.serviceOptions).toBeUndefined();
  });

  it('should be undefined when response throw error', async () => {
    listTipsByAuthKeySpy.mockClear();
    listTipsByAuthKeySpy.mockImplementation(() =>
      createSpyErrorResponse({ tips: [] })
    );

    const { result } = renderHooksWithRedux(() => useListTipsByAuthKey(), {});

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.businessOptions).toBeUndefined();
    expect(result.current.purposeOptions).toBeUndefined();
    expect(result.current.serviceOptions).toBeUndefined();
  });
});

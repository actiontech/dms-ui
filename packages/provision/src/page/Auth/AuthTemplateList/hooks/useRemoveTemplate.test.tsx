import { act, screen, cleanup } from '@testing-library/react';
import { sleep } from '~/testUtil/customQuery';
import { superRenderHooks } from '~/testUtil/customRender';
import mockApi from '~/testUtil/mockApi';
import useRemoveTemplate from './useRemoveTemplate';
import auth from '~/testUtil/mockApi/auth';

describe('useRemoveTemplate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('should send remove user request when user call removeDataPermissionTemplate method', async () => {
    const removeDataPermissionTemplateSpy = auth.removeDataPermissionTemplate();
    const refresh = jest.fn();
    const { result } = superRenderHooks(() => useRemoveTemplate(refresh));

    act(() => {
      result.current.removeTemplate({
        uid: '123',
        name: '123'
      });

      result.current.removeTemplate({
        uid: '123',
        name: '123'
      });
    });
    expect(removeDataPermissionTemplateSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.queryByText('正在删除模版 "123"...')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('正在删除模版 "123"...')).not.toBeInTheDocument();
    const successEl = await screen.findByText(`模版 "123" 删除成功`);

    expect(refresh).toBeCalledTimes(1);
    expect(successEl).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText(`模版 "123" 删除成功`)).not.toBeInTheDocument();

    await act(() => {
      result.current.removeTemplate({
        uid: '123'
      });
    });
    expect(removeDataPermissionTemplateSpy).toBeCalledTimes(2);
  });
});

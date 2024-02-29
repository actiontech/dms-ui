import { act, screen, cleanup, render } from '@testing-library/react';
import useRemoveTemplate from './useRemoveTemplate';
import auth from '~/testUtil/mockApi/auth';
import { useEffect } from 'react';

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

  /**
   * 使用 render 而不是用 renderHooks 的原因:
   * https://github.com/ant-design/ant-design/blob/e0534a1e852e0011e31ba88cc076cc2d08acda88/components/message/__tests__/hooks.test.tsx#L233C23-L233C23
   */
  it('should send remove user request when user call removeDataPermissionTemplate method', async () => {
    const removeDataPermissionTemplateSpy = auth.removeDataPermissionTemplate();
    const refresh = jest.fn();

    const Component = () => {
      const { removeTemplate, messageContextHolder } =
        useRemoveTemplate(refresh);
      useEffect(() => {
        removeTemplate({
          uid: '123',
          name: '123'
        });
      }, []);
      return <>{messageContextHolder}</>;
    };

    render(<Component />);

    expect(removeDataPermissionTemplateSpy).toBeCalledTimes(1);
    expect(removeDataPermissionTemplateSpy).toBeCalledWith({
      data_permission_template_uid: '123'
    });
    expect(screen.queryByText('正在删除模板 "123"...')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('正在删除模板 "123"...')).not.toBeInTheDocument();
    const successEl = await screen.findByText(`模板 "123" 删除成功`);

    expect(refresh).toBeCalledTimes(1);
    expect(successEl).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText(`模板 "123" 删除成功`)).not.toBeInTheDocument();
  });
});

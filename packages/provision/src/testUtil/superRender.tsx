import {
  superRender as sharedSuperRender,
  superRenderHook,
  createTestWrapper,
  WrapperOptions,
  RenderParams
} from '@actiontech/shared/lib/testUtil/superRender';
import { renderHook } from '@testing-library/react-hooks';
import lightTheme from '@actiontech/shared/lib/theme/light';
import { render } from '@testing-library/react';

const themeData = {
  ...lightTheme
};

export const provisionSuperRender = (
  ...[ui, option, otherProps]: [...RenderParams, WrapperOptions?]
): ReturnType<typeof render> => {
  return sharedSuperRender(ui, option, {
    ...otherProps,
    theme: themeData
  });
};

export const provisionSuperRenderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  renderHookOptions?: Omit<
    Parameters<typeof renderHook<TProps, TResult>>[1],
    'wrapper'
  >,
  wrapperOptions?: WrapperOptions
) => {
  const wrapper = createTestWrapper({
    ...wrapperOptions,
    theme: themeData
  });

  return superRenderHook(hook, {
    ...renderHookOptions,
    wrapper,
    theme: themeData
  });
};

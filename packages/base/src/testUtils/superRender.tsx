import {
  superRender,
  superRenderHook,
  WrapperOptions,
  RenderParams
} from '@actiontech/shared/lib/testUtil/superRender';
import { renderHook } from '@testing-library/react-hooks';
import lightTheme from '@actiontech/shared/lib/theme/light';
import basePackageTheme from '../theme/light';

const themeData = {
  ...lightTheme,
  ...basePackageTheme
};

export const baseSuperRender = (
  ...[ui, option, otherProps]: [...RenderParams, WrapperOptions?]
) => {
  return superRender(ui, option, {
    ...otherProps,
    theme: themeData
  });
};

export const baseSuperRenderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  renderHookOptions?: Omit<
    Parameters<typeof renderHook<TProps, TResult>>[1],
    'wrapper'
  >,
  wrapperOptions?: WrapperOptions
) => {
  return superRenderHook(hook, renderHookOptions, {
    ...wrapperOptions,
    theme: themeData
  });
};

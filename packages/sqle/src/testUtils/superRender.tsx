import {
  superRender,
  superRenderHook,
  WrapperOptions,
  RenderParams
} from '@actiontech/shared/lib/testUtil/superRender';
import sharedTheme from '@actiontech/shared/lib/theme/light';
import lightTheme from '../theme/light';
import { renderHook } from '@testing-library/react-hooks';
import { storeFactory } from './mockRedux';

const themeData = {
  ...sharedTheme,
  ...lightTheme
};

export const sqleSuperRender = (
  ...[ui, option, otherProps]: [...RenderParams, WrapperOptions?]
) => {
  return superRender(ui, option, {
    ...otherProps,
    theme: themeData,
    storeFactory: storeFactory
  });
};

export const sqleSuperRenderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  renderHookOptions?: Omit<
    Parameters<typeof renderHook<TProps, TResult>>[1],
    'wrapper'
  >,
  wrapperOptions?: WrapperOptions
) => {
  return superRenderHook(hook, renderHookOptions, {
    ...wrapperOptions,
    theme: themeData,
    storeFactory: storeFactory
  });
};

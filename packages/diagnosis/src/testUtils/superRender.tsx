import {
  superRender,
  superRenderHook,
  WrapperOptions,
  RenderParams
} from '@actiontech/shared/lib/testUtil/superRender';
import { renderHook } from '@testing-library/react-hooks';
import lightTheme from '@actiontech/shared/lib/theme/light';
import diagnosisPackageTheme from '../theme/light';
import { storeFactory } from './mockRedux';

const themeData = {
  ...lightTheme,
  ...diagnosisPackageTheme
};

export const diagnosisSuperRender = (
  ...[ui, option, otherProps]: [...RenderParams, WrapperOptions?]
) => {
  return superRender(ui, option, {
    ...otherProps,
    theme: themeData,
    storeFactory: storeFactory
  });
};

export const diagnosisSuperRenderHook = <TProps, TResult>(
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

import { render, renderHook as renderHookReact } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MutableSnapshot } from 'recoil';
import { MemoryRouterProps } from 'react-router-dom';
import { storeFactory } from './mockRedux';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { createTestWrapper as createTestWrapperDmsKit } from '@actiontech/dms-kit/src/testUtil/superRender';

export type RenderParams = Parameters<typeof render>;

export type RecoilRootPropsCustom = {
  initializeState?: (mutableSnapshot: MutableSnapshot) => void;
  override?: boolean;
};

export interface WrapperOptions {
  routerProps?: MemoryRouterProps;
  storeFactory?: (initStore: any) => ToolkitStore;
  initStore?: any;
  recoilRootProps?: RecoilRootPropsCustom;
  theme?: any;
}

export const createTestWrapper = (options?: WrapperOptions) => {
  const { storeFactory: customStoreFactory, initStore } = options || {};

  return ({ children }: { children: React.ReactNode }) => {
    const store = customStoreFactory
      ? customStoreFactory(initStore)
      : storeFactory(initStore);

    return (
      <Provider store={store}>
        {createTestWrapperDmsKit(options)({ children })}
      </Provider>
    );
  };
};

export const superRender = (
  ...[ui, option, options]: [...RenderParams, WrapperOptions?]
) => {
  const wrapper = createTestWrapper(options);

  return render(ui, {
    wrapper,
    ...option
  });
};

export const superRenderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  renderHookOptions?: Omit<
    Parameters<typeof renderHookReact<TProps, TResult>>[1],
    'wrapper'
  >,
  wrapperOptions?: WrapperOptions
) => {
  const wrapper = createTestWrapper(wrapperOptions);

  return renderHookReact(hook, {
    ...renderHookOptions,
    wrapper
  });
};

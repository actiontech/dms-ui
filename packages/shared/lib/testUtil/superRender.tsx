import { render, renderHook as renderHookReact } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { storeFactory } from './mockRedux';
import { ThemeProvider } from '@mui/system';
import { StyledEngineProvider } from '@mui/material/styles';
import lightTheme from '../theme/light';

export type RenderParams = Parameters<typeof render>;

export type RecoilRootPropsCustom = {
  initializeState?: (mutableSnapshot: MutableSnapshot) => void;
  override?: boolean;
};

export interface WrapperOptions {
  routerProps?: MemoryRouterProps;
  initStore?: any;
  recoilRootProps?: RecoilRootPropsCustom;
  theme?: any;
}

export const createTestWrapper = (options?: WrapperOptions) => {
  const {
    routerProps,
    initStore,
    recoilRootProps,
    theme = lightTheme
  } = options || {};

  return ({ children }: { children: React.ReactNode }) => {
    const themeComponent = (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    );

    return (
      <ConfigProvider
        locale={zhCN}
        theme={{ algorithm: antdTheme.defaultAlgorithm, hashed: false }}
      >
        <RecoilRoot {...recoilRootProps}>
          <Provider store={storeFactory(initStore)}>
            <MemoryRouter {...routerProps}>
              <StyledEngineProvider injectFirst>
                {themeComponent}
              </StyledEngineProvider>
            </MemoryRouter>
          </Provider>
        </RecoilRoot>
      </ConfigProvider>
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

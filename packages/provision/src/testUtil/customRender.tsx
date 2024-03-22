import { ThemeProvider } from '@mui/system';
import {
  render,
  renderHook,
  RenderHookOptions,
  RenderHookResult
} from '@testing-library/react';
import {
  BrowserRouter,
  MemoryRouter,
  MemoryRouterProps
} from 'react-router-dom';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import SyncRecoil from '~/utils/SyncRecoil';
import { JSXElementConstructor } from 'react';
import lightTheme from '@actiontech/shared/lib/theme/light';

type RenderParams = Parameters<typeof render>;
type RecoilRootPropsCustom = {
  initializeState?: (mutableSnapshot: MutableSnapshot) => void;
  override?: boolean;
};

export const renderWithRecoilRootWithRouter = (
  ...[ui, option, recoilRootProps]: [...RenderParams, RecoilRootPropsCustom?]
) => {
  return render(
    <BrowserRouter>
      <RecoilRoot {...recoilRootProps}>{ui}</RecoilRoot>
    </BrowserRouter>,
    option
  );
};

export const renderWithRecoilRootAndRouterAndTheme = (
  ...[ui, option, otherProps]: [
    ...RenderParams,
    {
      recoilRootProps?: RecoilRootPropsCustom;
    }?
  ]
) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <RecoilRoot {...otherProps?.recoilRootProps}>{ui}</RecoilRoot>
      </BrowserRouter>
    </ThemeProvider>,
    option
  );
};

export const renderWithRecoilRootWithMemoryRouter = (
  ...[ui, option, otherProps]: [
    ...RenderParams,
    {
      routerProps?: MemoryRouterProps;
      recoilRootProps?: RecoilRootPropsCustom;
    }?
  ]
) => {
  return render(
    <MemoryRouter {...otherProps?.routerProps}>
      <RecoilRoot {...otherProps?.recoilRootProps}>{ui}</RecoilRoot>
    </MemoryRouter>,
    option
  );
};

export const renderWithRecoilRootAndMemoRouterAndTheme = (
  ...[ui, option, otherProps]: [
    ...RenderParams,
    {
      routerProps?: MemoryRouterProps;
      recoilRootProps?: RecoilRootPropsCustom;
    }?
  ]
) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <MemoryRouter {...otherProps?.routerProps}>
        <RecoilRoot {...otherProps?.recoilRootProps}>
          <SyncRecoil />
          {ui}
        </RecoilRoot>
      </MemoryRouter>
    </ThemeProvider>,
    option
  );
};

export const superRenderHooksWrapperFactory = (
  otherChildren?: React.ReactNode,
  recoilRootProps?: RecoilRootPropsCustom
): JSXElementConstructor<any> => {
  return ({ children }: { children: React.ReactNode }) => (
    <RecoilRoot {...recoilRootProps}>
      {otherChildren}
      {children}
      <SyncRecoil />
    </RecoilRoot>
  );
};

export const superRenderHooks = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & {
    otherChildren?: React.ReactNode;
    recoilRootProps?: RecoilRootPropsCustom;
  }
): RenderHookResult<Result, Props> => {
  return renderHook(render, {
    wrapper: superRenderHooksWrapperFactory(
      options?.otherChildren,
      options?.recoilRootProps
    ),
    ...options
  });
};

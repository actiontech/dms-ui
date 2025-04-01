import { Dictionary } from '@actiontech/shared/lib/types/common.type';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/system';
import { Provider } from 'react-redux';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { storeFactory } from '@actiontech/shared/lib/testUtil/mockRedux';
import lightTheme from '@actiontech/shared/lib/theme/light';
import basePackageTheme from '../theme/light';

export type RenderParams = Parameters<typeof render>;

const themeData = {
  ...lightTheme,
  ...basePackageTheme
};

export const renderWithReduxAndTheme = (
  ...[ui, option, initStore]: [...RenderParams, Dictionary?]
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={themeData}>
        <Provider store={storeFactory(initStore)}>{children}</Provider>
      </ThemeProvider>
    ),
    ...option
  });
};

export const superRender = (
  ...[ui, option, otherProps]: [
    ...RenderParams,
    {
      routerProps?: MemoryRouterProps;
      initStore?: any;
    }?
  ]
) => {
  const renderReturn = render(ui, {
    wrapper: ({ children }) => {
      return (
        <Provider store={storeFactory(otherProps?.initStore)}>
          <MemoryRouter {...otherProps?.routerProps}>
            <ThemeProvider theme={themeData}>{children}</ThemeProvider>
          </MemoryRouter>
        </Provider>
      );
    },
    ...option
  });
  return renderReturn;
};

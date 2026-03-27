import { screen } from '@testing-library/react';
import { baseSuperRender } from '../../../../../testUtils/superRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import SqlRewrittenExampleDrawer from '.';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

describe('SqlRewrittenExampleDrawer', () => {
  beforeEach(() => {
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE,
    UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
  ]);

  it('should match snapshot', () => {
    const { baseElement } = baseSuperRender(
      <SqlRewrittenExampleDrawer open={true} onClose={jest.fn()} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render overall rewrite suggestions when open', () => {
    baseSuperRender(
      <SqlRewrittenExampleDrawer open={true} onClose={jest.fn()} />
    );

    expect(screen.getByText('整体重写建议')).toBeInTheDocument();
    expect(screen.getByText('已应用的规则')).toBeInTheDocument();
  });
});

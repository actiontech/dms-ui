import { cleanup } from '@testing-library/react';
import {
  renderHooksWithTheme,
  renderWithThemeAndRedux
} from '../../../../../../testUtils/customRender';

import { mockThemeStyleData } from '../../../../../../testUtils/mockHooks/mockThemeStyleData';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import LicenseColumn, {
  ILicenseColumn,
  renderLabelFormatter,
  renderLabelContent,
  renderTooltipFormatter,
  renderTooltipCustomContent
} from './licenseColumn';
import { ThemeData, SupportTheme } from '../../../../../../theme';

const themeData = ThemeData[SupportTheme.LIGHT];

describe('ReportStatistics/LicenseStatistics/LicenseColumn', () => {
  const ignoreAntdPlotsAttrAndFCRef = () => {
    const error = console.error;
    beforeAll(() => {
      console.error = (...arg) => {
        if (
          typeof arg[0] === 'string' &&
          (arg[0].includes(
            'If you accidentally passed it from a parent component, remove it from the DOM element.'
          ) ||
            arg[0].includes(
              'Attempts to access this ref will fail. Did you mean to use React.forwardRef()'
            ))
        ) {
          return;
        }
        error(...arg);
      };
    });

    afterAll(() => {
      console.error = error;
    });
  };
  ignoreAntdPlotsAttrAndFCRef();
  const customRender = (data?: ILicenseColumn['data']) => {
    return renderWithThemeAndRedux(
      <LicenseColumn
        onReady={jest.fn()}
        data={
          data || [
            {
              type: 'User',
              value: 0,
              desc: 'desc1',
              limit: 0
            }
          ]
        }
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockThemeStyleData();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap LicenseColumn empty', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap LicenseColumn empty', () => {
    const { baseElement } = customRender([
      {
        type: 'name1',
        value: 1,
        desc: 'desc1',
        limit: 1
      },
      {
        type: 'name2',
        value: 10,
        desc: 'desc2',
        limit: 10
      }
    ]);
    expect(baseElement).toMatchSnapshot();
  });

  it('render label formatter with full text', async () => {
    const { result } = renderHooksWithTheme(() => renderLabelFormatter('1', 1));
    expect(result.current).toStrictEqual('1');
  });

  it('render label formatter with ellipsis', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderLabelFormatter('1234', 3)
    );
    expect(result.current).toStrictEqual('1...');
  });

  it('render label content with limit', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderLabelContent({ value: 1, limit: 1 })
    );
    expect(result.current).toStrictEqual('100.00%');
  });

  it('render label content without limit', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderLabelContent({ value: 1 })
    );
    expect(result.current).toStrictEqual(1);
  });

  it('render tooltip formatter', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipFormatter({ type: '', value: '' })
    );
    expect(result.current).toStrictEqual({ name: '', value: '' });
  });

  it('render empty tooltip customContent', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipCustomContent([], themeData.sharedTheme)
    );
    expect(result.current).toBe(null);
  });

  it('render tooltip customContent', async () => {
    const { result } = renderHooksWithTheme(() =>
      renderTooltipCustomContent(
        [
          {
            color: 'red',
            data: {
              type: 'User',
              value: 0,
              limit: 0
            }
          }
        ],
        themeData.sharedTheme
      )
    );
    expect(result.current).toMatchSnapshot();
  });
});

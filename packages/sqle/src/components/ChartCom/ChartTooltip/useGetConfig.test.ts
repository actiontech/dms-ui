import { renderHook } from '@testing-library/react';

import useGetConfig from './useGetConfig';
import { SupportTheme, ThemeData } from '../../../theme';

const themeData = ThemeData[SupportTheme.LIGHT];

describe('sqle/components/ChartCom/ChartTooltip/useGetConfig', () => {
  const customRender = () => {
    return renderHook(() => useGetConfig(themeData.sqleTheme));
  };

  it('render useGetConfig when width is 200', () => {
    const { result } = customRender();
    expect(result.current.getDomStyles(200)).toMatchSnapshot();
  });
});

import { renderHooksWithRedux, renderHooksWithReduxAndRouter } from '@actiontech/shared/lib/testUtil/customRender';
import { fireEvent, act, cleanup } from '@testing-library/react';

import useSystemConfig from '.';

describe('hooks/useSystemConfig', () => {
  const customRender = (params = {}) => {
    return renderHooksWithRedux(() => useSystemConfig(), {
      system: {
        webTitle: 'SQLE',
        webLogoUrl: '',
        ...params
      }
    });
  };

  describe('render func renderWebTitle', () => {
    it('render no custom web title', () => {
      const { result } = customRender();
      const titleNode = result.current.renderWebTitle();
      expect(titleNode).toMatchSnapshot();
    });

    it('render has custom title', () => {
      const { result } = customRender({
        webTitle: 'DMS-自定义标题'
      });
      const titleNode = result.current.renderWebTitle();
      expect(titleNode).toMatchSnapshot();
    })
  });

  describe('render func syncWebTitleAndLogo', () => {
    const Component = () => {
      return <>
        <link id="dms-logo-favicon" rel="icon" href="/logo.png" />
      </>
    }
    beforeEach(() => {
      jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1612148800);
    });

    afterEach(() => {
      cleanup();
    });

    it('render with default info', () => {
      const customUIforHooks = renderHooksWithReduxAndRouter(() =>
        useSystemConfig(),
        {}
      );
      const { result } = customRender();
      result.current.syncWebTitleAndLogo({});
    })

  });


});

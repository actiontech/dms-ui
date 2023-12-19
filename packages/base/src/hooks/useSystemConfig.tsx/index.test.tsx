import { renderHooksWithRedux, superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { cleanup } from '@testing-library/react';
import { useEffect } from 'react';

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

  describe('render logoSrc', () => {
    it('render logoSrc default', () => {
      const { result } = customRender();
      expect(result.current.logoSrc).toMatchSnapshot();
    });

    it('render logoSrc default', () => {
      const { result } = customRender({
        webLogoUrl: 'webLogoUrl_value'
      });
      expect(result.current.logoSrc).toMatchSnapshot();
    });
  });

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
    beforeEach(() => {
      jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1612148800);
    });

    afterEach(() => {
      cleanup();
    });

    it('render with default info', () => {
      const Component = () => {
        const { syncWebTitleAndLogo } = useSystemConfig();
        useEffect(() => {
          syncWebTitleAndLogo({});
        }, []);
        return (
          <>
            <link id="dms-logo-favicon" rel="icon" href="/logo.png" />
          </>
        );
      };
      const { baseElement } = superRender(<Component />, undefined, { initStore: {} });
      expect(baseElement).toMatchSnapshot();
    })

    it('render with custom basicInfo', () => {
      const Component = () => {
        const { syncWebTitleAndLogo } = useSystemConfig();
        useEffect(() => {
          syncWebTitleAndLogo({ title: 'title1', logo_url: 'logo_url_demo' });
        }, []);
        return (
          <>
            <link id="dms-logo-favicon" rel="icon" href="/logo.png" />
          </>
        );
      };
      const { baseElement } = superRender(<Component />, undefined, {
        initStore: {}
      });
      expect(baseElement).toMatchSnapshot();
    });
  });

});

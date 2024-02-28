/**
 * @test_version ce
 */

import { MemoryRouterProps } from 'react-router-dom';
import { act, screen, cleanup } from '@testing-library/react';

import mockUseRoutes, { RenderRouterComponent } from './data';
import { superRender } from '../../testUtils/customRender';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('base/router-base-ce', () => {
  const projectID = mockProjectInfo.projectID;

  const customRender = (
    initialEntries: MemoryRouterProps['initialEntries'] = []
  ) => {
    return superRender(<RenderRouterComponent type="base" />, undefined, {
      routerProps: {
        initialEntries
      }
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    cleanup();
  });

  it('render base route data snap', () => {
    expect(mockUseRoutes('base')).toMatchSnapshot();
  });

  describe('render base router when version is ce', () => {
    it('render router home', async () => {
      const { baseElement } = customRender(['/']);

      expect(screen.getByText('home')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('render router userCenter', async () => {
      const { baseElement } = customRender(['/userCenter']);

      expect(screen.getByText('userCenter')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('render router system', async () => {
      const { baseElement } = customRender(['/system']);

      expect(screen.getByText('system')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('render router account', async () => {
      const { baseElement } = customRender(['/account']);

      expect(screen.getByText('account')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    describe('render router project', () => {
      it('render router cloudBeaver', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/cloudBeaver`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(screen.getByText('cloudBeaver')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });

      it('render route member', async () => {
        const { baseElement } = customRender([`/project/${projectID}/member`]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(screen.getByText('member')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });

      it('render route dataSourceList', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/db-services`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(baseElement).toMatchSnapshot();
      });

      it('render route dataSourceCreate', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/db-services/create`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(screen.getByText('dataSourceCreate')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });

      it('render route dataSourceUpdate', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/db-services/update/dbServiceUid`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(screen.getByText('dataSourceUpdate')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });
    });
  });
});

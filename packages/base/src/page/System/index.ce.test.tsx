/**
 * @test_version ce
 */
import SystemEEPage from '.';

import { cleanup, act, fireEvent } from '@testing-library/react';
import { baseSuperRender } from '../../testUtils/superRender';

import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';

import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('base/System-ee', () => {
  const customRender = () => {
    return baseSuperRender(<SystemEEPage />, undefined, {
      initStore: {
        system: {
          modalStatus: {},
          webTitle: DMS_DEFAULT_WEB_TITLE,
          webLogoUrl: ''
        }
      }
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    dms.mockAllApi();
    system.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();

    const segmentedEle = getAllBySelector(
      '.ant-segmented-item-label',
      baseElement
    );
    expect(segmentedEle.length).toBe(6);
    fireEvent.click(segmentedEle[1]);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});

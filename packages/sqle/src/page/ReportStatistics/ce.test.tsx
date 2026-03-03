/**
 * @test_version ce
 */

import { cleanup } from '@testing-library/react';
import { sqleSuperRender } from '../../testUtils/superRender';
import { mockThemeStyleData } from '../../testUtils/mockHooks/mockThemeStyleData';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

import ReportStatistics from '.';

describe('sqle/ReportStatistics CE', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockThemeStyleData();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = sqleSuperRender(<ReportStatistics />);
    expect(baseElement).toMatchSnapshot();
  });
});

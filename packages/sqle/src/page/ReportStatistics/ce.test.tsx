/**
 * @test_version ce
 */

import { cleanup } from '@testing-library/react';
import { sqleSuperRender } from '../../testUtils/superRender';
import { mockThemeStyleData } from '../../testUtils/mockHooks/mockThemeStyleData';

import ReportStatistics from '.';

describe('sqle/ReportStatistics CE', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockThemeStyleData();
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

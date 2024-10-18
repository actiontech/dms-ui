/**
 * @test_version ce
 */

import UserMenu from '.';
import { cleanup } from '@testing-library/react';
import { SupportTheme } from 'sqle/src/theme';
import { SupportLanguage } from '@actiontech/shared/lib/enum';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('base/Nav/SideMenu/UserMenu', () => {
  beforeEach(() => {
    mockUsePermission();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snapshot', () => {
    expect(
      toJson(
        shallow(
          <UserMenu
            language={SupportLanguage.zhCN}
            username="Admin"
            theme={SupportTheme.LIGHT}
            updateTheme={jest.fn()}
          />
        )
      )
    ).toMatchSnapshot();
  });
});

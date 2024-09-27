/**
 * @test_version ce
 */

import UserMenu from '.';

import { cleanup, fireEvent, act } from '@testing-library/react';
import { superRender } from '../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { SupportTheme } from 'sqle/src/theme';
import { SupportLanguage } from '@actiontech/shared/lib/enum';

describe('base/Nav/SideMenu/UserMenu', () => {
  const customRender = (
    isAdmin: boolean = true,
    isCertainProjectManager = true
  ) => {
    return superRender(
      <UserMenu
        hasGlobalViewingPermission
        language={SupportLanguage.zhCN}
        isAdmin={isAdmin}
        username="Admin"
        theme={SupportTheme.LIGHT}
        updateTheme={jest.fn()}
        isCertainProjectManager={isCertainProjectManager}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when current is admin', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click avatar icon', async () => {
    const { baseElement } = customRender();

    const iconAvatar = getBySelector('.ant-avatar-string', baseElement);
    fireEvent.click(iconAvatar);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click system icon', async () => {
    const { baseElement } = customRender();

    const iconAvatar = getBySelector('.custom-icon-global-system', baseElement);
    fireEvent.click(iconAvatar);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});

import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import SystemBasicTitle, { SystemBasicTitleProps } from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { cleanup } from '@testing-library/react';

describe('base/System/components/BasicTitle', () => {
  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (params: SystemBasicTitleProps) => {
    return superRender(<SystemBasicTitle {...params} />);
  };

  it('render title', () => {
    const { baseElement } = customRender({
      title: 'title cont',
      children: <span>child node</span>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render title when title other params', () => {
    const { baseElement } = customRender({
      title: 'title cont',
      children: 'children string',
      titleTip: 'this is title tip',
      titleExtra: <span>titleExtra</span>
    });
    expect(baseElement).toMatchSnapshot();
  });
});

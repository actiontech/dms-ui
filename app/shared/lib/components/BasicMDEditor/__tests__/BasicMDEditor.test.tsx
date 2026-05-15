import { superRender } from '../../../testUtil';
import BasicMDEditor from '../BasicMDEditor';
import { mockUseCurrentUser } from '../../../testUtil';
import { cleanup } from '@testing-library/react';
import { SupportTheme } from '@actiontech/dms-kit';

describe('BasicMDEditor', () => {
  beforeEach(() => {
    mockUseCurrentUser();
  });

  afterEach(() => {
    cleanup();
  });

  it('render init snap', () => {
    const { container } = superRender(<BasicMDEditor />);
    expect(container).toMatchSnapshot();
  });

  it('render custom theme', () => {
    const { container } = superRender(
      <BasicMDEditor customTheme={SupportTheme.DARK} />
    );
    expect(container).toMatchSnapshot();
  });
});

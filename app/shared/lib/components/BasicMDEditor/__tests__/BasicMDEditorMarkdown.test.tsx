import { superRender } from '../../../testUtil';
import BasicMDEditorMarkdown from '../BasicMDEditorMarkdown';
import { mockUseCurrentUser } from '../../../testUtil';
import { cleanup } from '@testing-library/react';
import { SupportTheme } from '@actiontech/dms-kit';

describe('BasicMDEditorMarkdown', () => {
  beforeEach(() => {
    mockUseCurrentUser();
  });

  afterEach(() => {
    cleanup();
  });

  it('render init snap', () => {
    const { container } = superRender(<BasicMDEditorMarkdown />);
    expect(container).toMatchSnapshot();
  });

  it('render custom theme', () => {
    const { container } = superRender(
      <BasicMDEditorMarkdown customTheme={SupportTheme.DARK} />
    );
    expect(container).toMatchSnapshot();
  });
});

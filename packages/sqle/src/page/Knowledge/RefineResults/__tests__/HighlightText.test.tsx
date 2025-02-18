import HighlightText from '../HighlightText';
import { superRender } from '../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('HighlightText', () => {
  it('render text', () => {
    const { container } = superRender(<HighlightText text="SELECT" />);
    expect(container).toMatchSnapshot();
  });

  it('render text with keyword', () => {
    const { container } = superRender(
      <HighlightText text="SELECT" keyword="select" />
    );
    expect(container).toMatchSnapshot();
    expect(getBySelector('.highlight-text')).toBeInTheDocument();
  });
});

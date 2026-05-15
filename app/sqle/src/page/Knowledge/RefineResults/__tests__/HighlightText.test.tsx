import HighlightText from '../HighlightText';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('HighlightText', () => {
  it('render text', () => {
    const { container } = sqleSuperRender(<HighlightText text="SELECT" />);
    expect(container).toMatchSnapshot();
  });

  it('render text with keyword', () => {
    const { container } = sqleSuperRender(
      <HighlightText text="SELECT" keyword="select" />
    );
    expect(container).toMatchSnapshot();
    expect(getBySelector('.highlight-text')).toBeInTheDocument();
  });
});

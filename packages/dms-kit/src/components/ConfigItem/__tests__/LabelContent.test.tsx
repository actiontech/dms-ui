import { screen } from '@testing-library/dom';
import { superRender } from '../../../testUtil/superRender';
import LabelContent, {
  IConfigItemLabelContentProps
} from '../components/LabelContent';

describe('lib/ConfigItem-LabelContent', () => {
  const customRender = (params: IConfigItemLabelContentProps) => {
    return superRender(<LabelContent {...params} />);
  };

  it('render title for LabelContent', () => {
    customRender({
      children: 'children title'
    });
    expect(screen.getByText('children title')).toBeInTheDocument();
  });

  it('render title & tips for LabelContent', () => {
    const { baseElement } = customRender({
      children: 'children title',
      tips: 'tips text'
    });
    expect(baseElement).toMatchSnapshot();
  });
});

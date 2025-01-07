import { renderWithTheme } from '../../../testUtil/customRender';
import LabelContent, {
  IConfigItemLabelContentProps
} from '../components/LabelContent';

describe('lib/ConfigItem-LabelContent', () => {
  const customRender = (params: IConfigItemLabelContentProps) => {
    return renderWithTheme(<LabelContent {...params} />);
  };

  it('render title for LabelContent', () => {
    const { baseElement } = customRender({
      children: 'children title'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render title & tips for LabelContent', () => {
    const { baseElement } = customRender({
      children: 'children title',
      tips: 'tips text'
    });
    expect(baseElement).toMatchSnapshot();
  });
});

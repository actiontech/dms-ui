import { renderWithTheme } from '../../testUtil/customRender';
import BasicResult from './BasicResult';
import { BasicResultProps } from './BasicResult.types';

describe('lib/BasicResult', () => {
  it('render result ui', () => {
    const params: BasicResultProps = {
      title: '这是一个标题',
      className: 'custom-result-box'
    };
    const { baseElement } = renderWithTheme(<BasicResult {...params} />);
    expect(baseElement).toMatchSnapshot();
  });
});

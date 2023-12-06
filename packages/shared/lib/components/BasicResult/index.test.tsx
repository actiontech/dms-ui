import { ResultProps } from 'antd';
import BasicResult from '.';
import { renderWithTheme } from '../../testUtil/customRender';

describe('lib/BasicResult', () => {
  it('render result ui', () => {
    const params: ResultProps = {
      title: '这是一个标题',
      className: 'custom-result-box'
    };
    const { baseElement } = renderWithTheme(<BasicResult {...params} />);
    expect(baseElement).toMatchSnapshot();
  });
});

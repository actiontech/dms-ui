import { superRender } from '../../testUtil/superRender';
import { getBySelector } from '../../testUtil/customQuery';
import PageHeader from './PageHeader';
import { PageHeaderProps } from './PageHeader.types';

describe('lib/PageHeader', () => {
  const customRender = (params: PageHeaderProps) => {
    return superRender(<PageHeader {...params} />);
  };

  it('should render full params', () => {
    const { baseElement } = customRender({
      fixed: true,
      title: <>这是一个标题</>,
      extra: <>这是一个extra</>
    });
    expect(getBySelector('.fixed-style', baseElement)).toBeInTheDocument();
  });

  it('should render no fixed', () => {
    const { container } = customRender({
      title: <>这是一个标题</>,
      extra: <>这是一个extra</>
    });
    expect(container).toMatchSnapshot();
  });
});

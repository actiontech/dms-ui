import { renderWithTheme } from '../../testUtil/customRender';
import { getBySelector } from '../../testUtil/customQuery';
import PageHeader from './PageHeader';
import { PageHeaderProps } from './PageHeader.types';

describe('lib/PageHeader', () => {
  const customRender = (params: PageHeaderProps) => {
    return renderWithTheme(<PageHeader {...params} />);
  };

  it('should render full params', () => {
    const { container, baseElement } = customRender({
      fixed: true,
      title: <>这是一个标题</>,
      extra: <>这是一个extra</>
    });
    expect(getBySelector('.fixed-style', baseElement)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render no fixed', () => {
    const { container } = customRender({
      title: <>这是一个标题</>,
      extra: <>这是一个extra</>
    });
    expect(container).toMatchSnapshot();
  });

  it('should render title', () => {
    const { container } = customRender({
      title: <>这是一个标题</>
    });
    expect(container).toMatchSnapshot();

    const { container: container1 } = customRender({
      fixed: true,
      title: <>这是一个标题</>
    });
    expect(container1).toMatchSnapshot();
  });
});

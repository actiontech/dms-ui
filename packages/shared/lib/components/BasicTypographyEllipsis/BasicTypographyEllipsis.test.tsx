import { superRender } from '../../testUtil/customRender';
import { screen } from '@testing-library/react';
import BasicTypographyEllipsis from './BasicTypographyEllipsis';
import { BasicTypographyEllipsisProps } from './BasicTypographyEllipsis.types';

describe('lib/BasicTypographyEllipsis', () => {
  const customRender = (params: BasicTypographyEllipsisProps) => {
    return superRender(
      <div style={{ maxWidth: 210 }}>
        <BasicTypographyEllipsis {...params} />
      </div>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  it('should render with tooltipLimitLength correctly', () => {
    const longText = '这是一个非常长的tool tip信息。'.repeat(10);
    const { container } = customRender({
      textCont: longText,
      tooltipLimitLength: 100,
      linkData: {
        route: '/',
        text: '查看更多'
      },
      tooltipsMaxWidth: 200
    });

    const typography = container.querySelector('.ant-typography');
    expect(typography).toBeInTheDocument();
    expect(typography).toHaveClass('ant-typography-ellipsis');
    expect(typography).toHaveAttribute('aria-label', longText);
  });

  it('should render with different tooltip configurations', () => {
    const { container: container1 } = customRender({
      textCont: '这是一个测试文本',
      tooltips: false
    });
    const typography1 = container1.querySelector('.ant-typography');
    expect(typography1).toBeInTheDocument();
    expect(typography1).not.toHaveClass('ant-typography-tooltip');

    const { container: container2 } = customRender({
      textCont: '这是一个测试文本',
      tooltips: true
    });
    const typography2 = container2.querySelector('.ant-typography');
    expect(typography2).toBeInTheDocument();
    expect(typography2).toHaveClass('ant-typography-ellipsis');

    const { container: container3 } = customRender({
      textCont: '这是一个测试文本',
      tooltips: {
        placement: 'bottom'
      }
    });
    expect(container3).toMatchSnapshot();
  });

  it('should render with custom className', () => {
    const { container } = customRender({
      textCont: '测试文本',
      className: 'custom-class'
    });
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('should render with copyable option', () => {
    const { container: container1 } = customRender({
      textCont: '测试文本',
      copyable: true
    });
    expect(container1.querySelector('.anticon-copy')).toBeInTheDocument();

    const { container: container2 } = customRender({
      textCont: '测试文本',
      copyable: false
    });
    expect(container2.querySelector('.anticon-copy')).not.toBeInTheDocument();
  });

  it('should render text content correctly', () => {
    customRender({
      textCont: '测试文本内容'
    });
    expect(screen.getByText('测试文本内容')).toBeInTheDocument();
  });
});

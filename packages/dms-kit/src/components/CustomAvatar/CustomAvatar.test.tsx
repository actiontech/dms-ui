import { superRender } from '../../testUtil/superRender';
import CustomAvatar from './CustomAvatar';
import { CustomAvatarProps } from './CustomAvatar.types';
import { screen } from '@testing-library/react';

describe('lib/CustomAvatar', () => {
  const customRender = (params: CustomAvatarProps) => {
    return superRender(<CustomAvatar {...params} />);
  };

  it('should render avatar with image when src is provided', () => {
    const imgSrc = 'https://example.com/avatar.jpg';
    const { container } = customRender({
      src: imgSrc,
      name: '张三'
    });
    const avatarImg = container.querySelector('img');
    expect(avatarImg).toHaveAttribute('src', imgSrc);
    expect(container).toMatchSnapshot();
  });

  it('should render avatar with first letter of name when src is not provided', () => {
    customRender({
      name: '张三',
      size: 20
    });
    expect(screen.getByText('张')).toBeInTheDocument();
  });

  it('should render avatar with tooltip when noTips is false', () => {
    customRender({
      name: '李四',
      className: 'custom-self-avatar'
    });
    expect(screen.getByText('李')).toBeInTheDocument();
    const tooltipWrapper = screen
      .getByText('李')
      .closest('.basic-tooltips-wrapper');
    expect(tooltipWrapper).toBeInTheDocument();
  });

  it('should render avatar without tooltip when noTips is true', () => {
    const { container } = customRender({
      name: '李四',
      noTips: true,
      className: 'custom-self-avatar'
    });
    expect(screen.getByText('李')).toBeInTheDocument();
    expect(
      container.querySelector('.basic-tooltips-wrapper')
    ).not.toBeInTheDocument();
  });

  it('should render avatar with custom class name', () => {
    customRender({
      name: 'lily',
      className: 'custom-avatar-class',
      toolTipsWrapperClassName: 'custom-tooltip-class'
    });
    expect(screen.getByText('L')).toBeInTheDocument();
    const tooltipWrapper = screen
      .getByText('L')
      .closest('.basic-tooltips-wrapper');
    expect(tooltipWrapper).toHaveClass('custom-tooltip-class');
  });
});

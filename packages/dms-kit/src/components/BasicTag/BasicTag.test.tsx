import { superRender } from '../../testUtil/superRender';
import BasicTag from './BasicTag';
import { BasicTagProps } from './BasicTag.types';

describe('lib/BasicTag', () => {
  const customRender = (params: BasicTagProps) => {
    return superRender(<BasicTag {...params} />);
  };

  it('should match snapshot', () => {
    const { container } = customRender({});
    expect(container).toMatchSnapshot();
  });

  describe('size prop', () => {
    it('should render with large size', () => {
      const { container } = customRender({ size: 'large' });
      expect(
        container.querySelector('.basic-large-tag-wrapper')
      ).toBeInTheDocument();
    });

    it('should render with small size', () => {
      const { container } = customRender({ size: 'small' });
      expect(
        container.querySelector('.basic-small-tag-wrapper')
      ).toBeInTheDocument();
    });

    it('should render with default size', () => {
      const { container } = customRender({ size: 'default' });
      expect(
        container.querySelector('.basic-default-tag-wrapper')
      ).toBeInTheDocument();
    });

    it('should use default size when size prop is not provided', () => {
      const { container } = customRender({});
      expect(
        container.querySelector('.basic-default-tag-wrapper')
      ).toBeInTheDocument();
    });
  });

  it('should pass additional className to the wrapper', () => {
    const { container } = customRender({ className: 'custom-class' });
    const tagElement = container.querySelector('.basic-tag-wrapper');
    expect(tagElement).toHaveClass('custom-class');
  });
});

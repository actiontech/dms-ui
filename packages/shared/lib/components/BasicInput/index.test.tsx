import BasicInput from '.';
import { InputProps } from 'antd';
import { PasswordProps, TextAreaProps } from 'antd/es/input';

import { renderWithTheme } from '../../testUtil/customRender';

describe('lib/BasicInput', () => {
  describe('-Input', () => {
    const customRender = (params: InputProps) => {
      return renderWithTheme(<BasicInput {...params} />);
    };

    it('render diff size input', () => {
      const { container } = customRender({
        size: 'large'
      });
      expect(container).toMatchSnapshot();

      const { container: container1 } = customRender({
        size: 'middle'
      });
      expect(container1).toMatchSnapshot();

      const { container: container2 } = customRender({
        size: 'small'
      });
      expect(container2).toMatchSnapshot();
    });

    it('render add custom class name', () => {
      const { container } = customRender({
        className: 'custom-name'
      });
      expect(container).toMatchSnapshot();
    });

    it('render clear icon', () => {
      const { container } = customRender({
        allowClear: true
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('-Password', () => {
    const customRender = (params: PasswordProps) => {
      return renderWithTheme(<BasicInput.Password {...params} />);
    };

    it('render diff size pwd', () => {
      const { container } = customRender({
        size: 'large'
      });
      expect(container).toMatchSnapshot();

      const { container: container1 } = customRender({
        size: 'middle'
      });
      expect(container1).toMatchSnapshot();

      const { container: container2 } = customRender({
        size: 'small'
      });
      expect(container2).toMatchSnapshot();
    });
  });

  describe('-TextArea', () => {
    const customRender = (params: TextAreaProps) => {
      return renderWithTheme(<BasicInput.TextArea {...params} />);
    };
    it('render diff size textarea', () => {
      const { container } = customRender({
        size: 'large'
      });
      expect(container).toMatchSnapshot();

      const { container: container1 } = customRender({
        size: 'middle'
      });
      expect(container1).toMatchSnapshot();

      const { container: container2 } = customRender({
        size: 'small'
      });
      expect(container2).toMatchSnapshot();
    });
  });
});

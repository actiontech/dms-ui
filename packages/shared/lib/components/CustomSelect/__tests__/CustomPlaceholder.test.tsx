import { screen } from '@testing-library/dom';
import { superRender } from '../../../testUtil/superRender';
import CustomPlaceholder, { ICustomPlaceholder } from '../CustomPlaceholder';

describe('lib/CustomPlaceholder', () => {
  const customRender = (params: ICustomPlaceholder) => {
    return superRender(<CustomPlaceholder {...params} />);
  };

  it('render ui when has prefix', () => {
    customRender({
      prefix: 'prefix string',
      placeholder: 'placeholder string'
    });

    expect(screen.getByText('prefix string')).toBeInTheDocument();
    expect(screen.getByText('placeholder string')).toBeInTheDocument();
  });

  it('render ui when no prefix', () => {
    const { container } = customRender({
      placeholder: 'placeholder string'
    });

    expect(container).toMatchSnapshot();
  });
});

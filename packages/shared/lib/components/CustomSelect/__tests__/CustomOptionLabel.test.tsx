import { screen } from '@testing-library/dom';
import { superRender } from '../../../testUtil/customRender';

import CustomOptionLabel, { ICustomOptionLabel } from '../CustomOptionLabel';

describe('lib/CustomOptionLabel', () => {
  const customRender = (params: ICustomOptionLabel) => {
    return superRender(<CustomOptionLabel {...params} />);
  };

  it('render ui when has prefix', () => {
    customRender({
      prefix: 'prefix string',
      label: 'label string'
    });

    expect(screen.getByText('prefix string')).toBeInTheDocument();
    expect(screen.getByText('label string')).toBeInTheDocument();
  });

  it('render ui when no prefix', () => {
    const { container } = customRender({
      label: 'label string'
    });

    expect(container).toMatchSnapshot();
  });
});

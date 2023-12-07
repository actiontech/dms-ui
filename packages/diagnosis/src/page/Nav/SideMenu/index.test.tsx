import SideMenu from '.';
import { superRender } from '../../../testUtils/customRender';
import { screen } from '@testing-library/react';

describe('diagnosis/SideMenu', () => {
  it('should match snapshot', async () => {
    const { baseElement } = superRender(<SideMenu />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Diagnosis')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import ProvisionTable from '../ProvisionTable';

describe('ProvisionTable', () => {
  it('should have default pageSize', async () => {
    render(<ProvisionTable pagination={{ total: 100 }} columns={[]} />);
    const pageNumElement = await screen.findByText('20 / page');
    expect(pageNumElement).toBeInTheDocument();
  });
});

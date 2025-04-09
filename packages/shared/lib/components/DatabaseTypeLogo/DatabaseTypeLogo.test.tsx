import { render, screen } from '@testing-library/react';
import DatabaseTypeLogo from './DatabaseTypeLogo';

describe('test DatabaseTypeLogo', () => {
  test('should match snapshot', () => {
    const { container, rerender } = render(
      <DatabaseTypeLogo dbType="mysql" logoUrl="" />
    );

    expect(screen.getByText('mysql')).toBeInTheDocument();

    rerender(
      <DatabaseTypeLogo dbType="db2" logoUrl="/static/medit/logo.png" />
    );
    expect(container).toMatchSnapshot();
  });
});

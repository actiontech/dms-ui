import { RenderSQLProps } from './index.type';
import RenderSQL from '.';

import { renderWithTheme } from '../../testUtils/customRender';

describe('sqle/components/RenderSQL', () => {
  const customRender = (params: RenderSQLProps) => {
    return renderWithTheme(<RenderSQL {...params} />);
  };

  it('render snap when no sql', () => {
    const { baseElement } = customRender({});
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has tool', () => {
    const { baseElement } = customRender({
      sql: `CREATE TABLE your_table_name (
  telephone_number VARCHAR(20),
  email_address VARCHAR(255),
  china_id_card VARCHAR(18),
  debit_card_account_number VARCHAR(20),
  credit_card VARCHAR(16),
  name VARCHAR(100),
  mac_address VARCHAR(17),
  bitcoin VARCHAR(50),
  age INT
);`,
      rows: 3,
      tooltip: <span>tool tip</span>,
      onClick: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  })
});

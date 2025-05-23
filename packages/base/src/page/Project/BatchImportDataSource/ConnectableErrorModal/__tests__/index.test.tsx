import { screen } from '@testing-library/react';
import ConnectableErrorModal from '../index';
import { baseSuperRender } from '../../../../../testUtils/superRender';

describe('ConnectableErrorModal', () => {
  const defaultProps = {
    modalOpen: true,
    closeModal: jest.fn(),
    onSumit: jest.fn(),
    loading: false,
    connectErrorList: [
      {
        name: 'mysql-db',
        connect_error_message: 'Connection timeout'
      },
      {
        name: 'postgres-db',
        connect_error_message: 'Authentication failed'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render error list correctly', () => {
    const { baseElement } = baseSuperRender(
      <ConnectableErrorModal {...defaultProps} />
    );
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('mysql-db')).toBeInTheDocument();
    expect(screen.getByText('postgres-db')).toBeInTheDocument();
    expect(screen.getByText('Connection timeout')).toBeInTheDocument();
    expect(screen.getByText('Authentication failed')).toBeInTheDocument();
  });
});

import { superRender } from '@actiontech/shared/lib/testUtil';
import ErrorBoundary from '../index';
import { useNavigate } from 'react-router-dom';
import { fireEvent, screen } from '@testing-library/react';

jest.mock('react-error-boundary', () => ({
  ErrorBoundary: ({
    children,
    fallbackRender
  }: {
    children: React.ReactNode;
    fallbackRender: (props: {
      error: Error;
      resetErrorBoundary: () => void;
    }) => React.ReactNode;
  }) => {
    return (
      <>
        {fallbackRender({
          error: new Error('test'),
          resetErrorBoundary: jest.fn()
        })}
        {children}
      </>
    );
  }
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('base/ErrorBoundary', () => {
  it('should render error boundary', () => {
    const navigateSpy = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    const { baseElement } = superRender(
      <ErrorBoundary>
        <div>test</div>
      </ErrorBoundary>
    );
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('返回首页'));
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });
});

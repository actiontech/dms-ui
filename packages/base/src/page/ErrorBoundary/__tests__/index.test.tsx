import { superRender } from '@actiontech/shared/lib/testUtil';
import ErrorBoundary, {
  isChunkLoadError,
  forceReloadWithCache,
  errorFallback
} from '../index';
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
  describe('isChunkLoadError', () => {
    it('should detect chunk load errors', () => {
      expect(
        isChunkLoadError(
          new Error('Failed to fetch dynamically imported module')
        )
      ).toBe(true);
      expect(isChunkLoadError(new Error('Loading chunk 123 failed'))).toBe(
        true
      );
      expect(isChunkLoadError(new Error('ChunkLoadError'))).toBe(true);
    });

    it('should not detect normal errors', () => {
      expect(isChunkLoadError(new Error('normal error'))).toBe(false);
    });
  });

  describe('forceReloadWithCache', () => {
    beforeEach(() => {
      delete (window as any).location;
      (window as any).location = { href: 'http://localhost:3000' };
    });

    it('should add timestamp to URL', () => {
      forceReloadWithCache();
      expect(window.location.href).toMatch(/\?_t=\d+/);
    });
  });

  describe('errorFallback', () => {
    const mockNavigate = jest.fn();
    const mockResetErrorBoundary = jest.fn();

    it('should render chunk error UI', () => {
      const error = new Error('Failed to fetch dynamically imported module');
      superRender(
        <>
          {errorFallback({
            error,
            resetErrorBoundary: mockResetErrorBoundary,
            navigate: mockNavigate
          })}
        </>
      );
      expect(screen.getByText('系统已更新')).toBeInTheDocument();
    });

    it('should render normal error UI', () => {
      const error = new Error('test error');
      superRender(
        <>
          {errorFallback({
            error,
            resetErrorBoundary: mockResetErrorBoundary,
            navigate: mockNavigate
          })}
        </>
      );
      expect(screen.getByText('出错了')).toBeInTheDocument();
    });
  });

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

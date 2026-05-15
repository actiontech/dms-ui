import { screen } from '@testing-library/react';
import { superRender } from '../../../testUtil/superRender';
import { TypedLink } from '..';

describe('TypedLink', () => {
  it('should render basic link with string path correctly', () => {
    superRender(
      <TypedLink to="/test" target="_blank" data-testid="test-link">
        Test Link
      </TypedLink>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveTextContent('Test Link');
  });

  it('should handle path params correctly', () => {
    const pathConfig = {
      path: '/user/:id/profile/:tab'
    } as const;

    superRender(
      <TypedLink
        to={pathConfig}
        params={{ id: '123', tab: 'info' }}
        data-testid="test-link"
      >
        User Profile
      </TypedLink>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('href', '/user/123/profile/info');
  });

  it('should handle query params correctly', () => {
    const pathConfig = {
      path: '/search',
      query: 'q&page&sort'
    } as const;

    superRender(
      <TypedLink
        to={pathConfig}
        queries={{ q: 'test', page: '1', sort: 'desc' }}
        data-testid="test-link"
      >
        Search
      </TypedLink>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('href', '/search?q=test&page=1&sort=desc');
  });

  it('should render link with object path correctly', () => {
    const pathConfig = {
      prefix: '/prefix',
      path: 'test',
      query: 'query1&query2'
    } as const;

    superRender(
      <TypedLink to={pathConfig} data-testid="test-link">
        Test Link
      </TypedLink>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('href', '/prefix/test');
  });

  it('should forward ref correctly', () => {
    const ref = jest.fn();

    superRender(
      <TypedLink to="/test" ref={ref} data-testid="test-link">
        Test Link
      </TypedLink>
    );

    expect(ref).toHaveBeenCalled();
  });

  it('should pass through additional props correctly', () => {
    superRender(
      <TypedLink
        to="/test"
        className="custom-class"
        style={{ color: 'red' }}
        data-testid="test-link"
      >
        Test Link
      </TypedLink>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveClass('custom-class');
    expect(link).toHaveStyle({ color: 'red' });
  });

  it('should handle complex path with both params and queries', () => {
    const pathConfig = {
      prefix: '/app',
      path: 'user/:id/posts/:postId',
      query: 'view&filter'
    } as const;

    superRender(
      <TypedLink
        to={pathConfig}
        params={{ id: '123', postId: '456' }}
        queries={{ view: 'detail' }}
        data-testid="test-link"
      >
        User Post
      </TypedLink>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('href', '/app/user/123/posts/456?view=detail');
  });
});

describe('TypedLink Edge Cases', () => {
  it('should handle empty query params correctly', () => {
    const pathConfig = {
      path: '/test',
      query: 'q'
    } as const;

    superRender(
      <TypedLink to={pathConfig} queries={{}} data-testid="test-link">
        Test
      </TypedLink>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should handle undefined query params correctly', () => {
    const pathConfig = {
      path: '/test',
      query: 'q&page'
    } as const;

    superRender(
      <TypedLink
        to={pathConfig}
        queries={{ q: 'test', page: undefined }}
        data-testid="test-link"
      >
        Test
      </TypedLink>
    );

    const link = screen.getByTestId('test-link');
    expect(link).toHaveAttribute('href', '/test?q=test');
  });
});

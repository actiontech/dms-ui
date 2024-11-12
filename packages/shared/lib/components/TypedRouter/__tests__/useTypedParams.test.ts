import { renderHook } from '@testing-library/react-hooks';
import { useParams } from 'react-router-dom';
import { useTypedParams } from '..';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}));

describe('useTypedParams', () => {
  it('should handle params correctly', () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1', postId: '2' });

    const pathConfig = {
      prefix: '/app',
      path: 'user/:id/posts/:postId',
      query: 'view&filter'
    } as const;
    const { result } = renderHook(() => useTypedParams<typeof pathConfig>());

    expect(result.current.id).toBe('1');
    expect(result.current.postId).toBe('2');
  });
});

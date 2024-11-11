import {
  formatPath,
  getFormatPathValues,
  isCustomRoutePathObject,
  parse2ReactRouterPath
} from '../utils';

describe('utils', () => {
  describe('isCustomRoutePathObject', () => {
    it('should identify valid route path objects', () => {
      expect(isCustomRoutePathObject({ path: '/test' })).toBe(true);
      expect(isCustomRoutePathObject({ prefix: '/api', path: '/test' })).toBe(
        true
      );
      expect(isCustomRoutePathObject({ path: '/test', query: 'q&page' })).toBe(
        true
      );
    });

    it('should reject invalid route path objects', () => {
      expect(isCustomRoutePathObject('/test')).toBe(false);
      expect(isCustomRoutePathObject(null as any)).toBe(false);
      expect(isCustomRoutePathObject(undefined as any)).toBe(false);
      expect(isCustomRoutePathObject({})).toBe(false);
      expect(isCustomRoutePathObject({ prefix: '/api' } as any)).toBe(false);
    });
  });

  describe('getFormatPathValues', () => {
    it('should format path values with params only', () => {
      const result = getFormatPathValues({
        params: { id: '123', tab: 'profile' }
      });

      expect(result).toEqual({
        params: { id: '123', tab: 'profile' }
      });
    });

    it('should format path values with queries only', () => {
      const path = { path: '/', query: 'sort&page' } as const;
      const result = getFormatPathValues<typeof path>({
        queries: { sort: 'asc', page: '1' }
      });

      expect(result).toEqual({
        queries: { sort: 'asc', page: '1' }
      });
    });

    it('should format path values with both params and queries', () => {
      const path = { path: '/home/:id', query: 'view' } as const;

      const result = getFormatPathValues<typeof path>({
        params: { id: '123' },
        queries: { view: 'detail' }
      });

      expect(result).toEqual({
        params: { id: '123' },
        queries: { view: 'detail' }
      });
    });

    it('should handle empty or undefined values', () => {
      expect(getFormatPathValues({} as any)).toBeUndefined();
      expect(getFormatPathValues({ params: {} as any })).toEqual({
        params: {}
      });
      expect(getFormatPathValues({ queries: {} } as any)).toEqual({
        queries: {}
      });
    });
  });

  describe('formatPath & parse2ReactRouterPath', () => {
    describe('error cases', () => {
      it('should throw error when values is null', () => {
        expect(() => {
          formatPath('/test', null as any);
        }).toThrow('Value must be a non-null object');
      });

      it('should throw error when values is undefined', () => {
        expect(() => {
          formatPath('/test', undefined as any);
        }).toThrow('Value must be a non-null object');
      });

      it('should throw error when values is not an object', () => {
        expect(() => {
          formatPath('/test', 'string' as any);
        }).toThrow('Value must be a non-null object');

        expect(() => {
          formatPath('/test', 123 as any);
        }).toThrow('Value must be a non-null object');

        expect(() => {
          formatPath('/test', true as any);
        }).toThrow('Value must be a non-null object');
      });

      it('should throw error when required parameter is missing', () => {
        const path = '/users/:id/posts/:postId';
        const values = {
          params: {
            id: '123'
            // missing postId
          }
        };

        expect(() => {
          formatPath(path, values);
        }).toThrow('Missing value for parameter "postId" in path');
      });

      it('should throw error when parameter value is null', () => {
        const path = '/users/:id';
        const values = {
          params: {
            id: null as any
          }
        };

        expect(() => {
          formatPath(path, values);
        }).toThrow('Value for parameter "id" cannot be null or undefined');
      });

      it('should throw error when parameter value is undefined', () => {
        const path = '/users/:id';
        const values = {
          params: {
            id: undefined as any
          }
        };

        expect(() => {
          formatPath(path, values);
        }).toThrow('Value for parameter "id" cannot be null or undefined');
      });
    });

    it('should parse simple paths', () => {
      expect(parse2ReactRouterPath({ path: '/test' })).toBe('/test');
    });

    it('should parse paths with prefix', () => {
      expect(parse2ReactRouterPath({ prefix: '/api', path: 'test' })).toBe(
        '/api/test'
      );
    });

    it('should parse paths with params', () => {
      const result = parse2ReactRouterPath(
        { path: '/user/:id/profile/:tab' },
        { params: { id: '123', tab: 'settings' } }
      );
      expect(result).toBe('/user/123/profile/settings');
    });

    it('should parse paths with queries', () => {
      const result = parse2ReactRouterPath(
        { path: '/search', query: 'q&page' },
        { queries: { q: 'test', page: '1' } }
      );
      expect(result).toBe('/search?q=test&page=1');
    });

    it('should handle optional queries', () => {
      const result = parse2ReactRouterPath(
        { path: '/search', query: 'q&page&sort' },
        { queries: { q: 'test', page: '1' } }
      );
      expect(result).toBe('/search?q=test&page=1');
    });

    it('should handle complex paths', () => {
      const result = parse2ReactRouterPath(
        {
          prefix: '/app',
          path: '/user/:id/posts/:postId',
          query: 'view&filter'
        },
        {
          params: { id: '123', postId: '456' },
          queries: { view: 'detail', filter: 'recent' }
        }
      );
      expect(result).toBe('/app/user/123/posts/456?view=detail&filter=recent');
    });
  });
});

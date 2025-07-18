/* eslint-disable @typescript-eslint/no-unused-vars */
import { To, useNavigate as useRouterNavigate } from 'react-router-dom';
import {
  getFormatPathValues,
  isCustomRoutePathObject,
  parse2ReactRouterPath
} from '../utils';
import {
  NavigateTypedOptions,
  ObjectRoutePathValue,
  NavigateFunction
} from '../TypedRouter.types';
import { useCallback } from 'react';

const useTypedNavigate = () => {
  const innerNavigate = useRouterNavigate();
  const navigate: NavigateFunction = useCallback(
    <T extends ObjectRoutePathValue>(
      to: T | To | number,
      options?: NavigateTypedOptions<T>
    ) => {
      if (typeof to === 'number') {
        innerNavigate(to);
      } else if (isCustomRoutePathObject(to)) {
        if (options) {
          const values = getFormatPathValues(options);
          if ('params' in options && 'queries' in options) {
            const { params, queries, ...otherOptions } = options;

            if (otherOptions && Object.keys(otherOptions).length > 0) {
              innerNavigate(parse2ReactRouterPath(to, values), otherOptions);
            } else {
              innerNavigate(parse2ReactRouterPath(to, values));
            }

            // otherOptions && Object.keys(otherOptions).length > 0
            //   ? innerNavigate(parse2ReactRouterPath(to, values), otherOptions)
            //   : innerNavigate(parse2ReactRouterPath(to, values));
          } else if ('params' in options) {
            const { params, ...otherOptions } = options;
            if (otherOptions && Object.keys(otherOptions).length > 0) {
              innerNavigate(parse2ReactRouterPath(to, values), otherOptions);
            } else {
              innerNavigate(parse2ReactRouterPath(to, values));
            }
            // otherOptions && Object.keys(otherOptions).length > 0
            //   ? innerNavigate(parse2ReactRouterPath(to, values), otherOptions)
            //   : innerNavigate(parse2ReactRouterPath(to, values));
          } else if ('queries' in options) {
            const { queries, ...otherOptions } = options;
            if (otherOptions && Object.keys(otherOptions).length > 0) {
              innerNavigate(parse2ReactRouterPath(to, values), otherOptions);
            } else {
              innerNavigate(parse2ReactRouterPath(to, values));
            }
            // otherOptions && Object.keys(otherOptions).length > 0
            //   ? innerNavigate(parse2ReactRouterPath(to, values), otherOptions)
            //   : innerNavigate(parse2ReactRouterPath(to, values));
          } else {
            innerNavigate(parse2ReactRouterPath(to, values), options);
          }
        } else {
          innerNavigate(parse2ReactRouterPath(to));
        }
      } else {
        if (options) {
          innerNavigate(to, options);
        } else {
          innerNavigate(to);
        }
        // options ? innerNavigate(to, options) : innerNavigate(to);
      }
    },
    [innerNavigate]
  );

  return navigate;
};

export default useTypedNavigate;

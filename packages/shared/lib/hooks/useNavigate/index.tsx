import { useCallback } from 'react';
import {
  NavigateFunction,
  NavigateOptions,
  To,
  useNavigate as useOriginNavigate
} from 'react-router-dom';

function navigateFunction(
  innerNavigate: NavigateFunction,
  baseUrl: string,
  delta: number
): void;
function navigateFunction(
  innerNavigate: NavigateFunction,
  baseUrl: string,
  to: To,
  options?: NavigateOptions
): void;
function navigateFunction(
  innerNavigate: NavigateFunction,
  baseUrl: string,
  to: number | To,
  options?: NavigateOptions
) {
  if (typeof to === 'number') {
    return innerNavigate(to);
  }

  if (!baseUrl) {
    return innerNavigate(to, options);
  }

  if (typeof to === 'string') {
    if (to.startsWith(baseUrl)) {
      return innerNavigate(to, options);
    }
    return innerNavigate(`${baseUrl}${to}`, options);
  }

  if (to.pathname?.startsWith(baseUrl)) {
    return innerNavigate(to, options);
  }

  return innerNavigate(
    {
      ...to,
      pathname: to.pathname ? `${baseUrl}${to.pathname}` : undefined
    },
    options
  );
}

/**
 * @deprecated 后续会移除该 hooks, 需要在重构过程中替换会原生 useNavigate
 */
const useNavigate = (baseUrl = ''): NavigateFunction => {
  const innerNavigate = useOriginNavigate();

  const navigate = useCallback(
    (to: number | To, options?: NavigateOptions) => {
      if (typeof to === 'number') {
        navigateFunction(innerNavigate, baseUrl, to);
      } else {
        navigateFunction(innerNavigate, baseUrl, to, options);
      }
    },
    [innerNavigate, baseUrl]
  );

  return navigate;
};

export default useNavigate;

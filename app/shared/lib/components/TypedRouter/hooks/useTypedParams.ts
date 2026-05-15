import { useParams } from 'react-router-dom';
import { InferParamsFromConfig, RoutePathValue } from '../TypedRouter.types';

function useTypedParams<T extends RoutePathValue>() {
  return useParams<InferParamsFromConfig<T>>();
}
export default useTypedParams;

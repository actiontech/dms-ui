import { useParams } from 'react-router-dom';
import { InferParamsFromConfig, RoutePathValue } from '../index.type';

function useTypedParams<T extends RoutePathValue>() {
  return useParams<InferParamsFromConfig<T>>();
}
export default useTypedParams;

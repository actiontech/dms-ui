/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams } from 'react-router-dom';
import { InferParamsFromConfig, RouteConfig } from '../index.type';

function useCustomParams<T extends RouteConfig[keyof RouteConfig]>() {
  return useParams() as InferParamsFromConfig<T>;
}
export default useCustomParams;

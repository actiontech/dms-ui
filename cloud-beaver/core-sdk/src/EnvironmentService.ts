import { GlobalConstants } from './utils/GlobalConstants';

export class EnvironmentService {
  readonly gqlEndpoint = GlobalConstants.absoluteServiceHTTPUrl('gql');
  readonly wsEndpoint = GlobalConstants.absoluteServiceWSUrl('ws');
}

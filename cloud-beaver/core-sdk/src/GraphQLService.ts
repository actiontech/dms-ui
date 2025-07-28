/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2024 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { CustomGraphQLClient } from './CustomGraphQLClient';
import { EnvironmentService } from './EnvironmentService';
import { uploadBlobResultSetExtension } from './Extensions/uploadBlobResultSetExtension';
import { uploadDriverLibraryExtension } from './Extensions/uploadDriverLibraryExtension';
import { uploadResultDataExtension } from './Extensions/uploadResultDataExtension';
import type { IResponseInterceptor } from './IResponseInterceptor';
import { getSdk, type Sdk } from './sdk';

function extendedSDK(
  client: CustomGraphQLClient
): Sdk &
  ReturnType<typeof uploadDriverLibraryExtension> &
  ReturnType<typeof uploadBlobResultSetExtension> &
  ReturnType<typeof uploadResultDataExtension> {
  const sdk = getSdk(client);

  return {
    ...sdk,
    ...uploadDriverLibraryExtension(client),
    ...uploadBlobResultSetExtension(client),
    ...uploadResultDataExtension(client)
  };
}

export class GraphQLService {
  sdk: ReturnType<typeof extendedSDK>;

  readonly client: CustomGraphQLClient;

  constructor(private readonly environmentService: EnvironmentService) {
    const gqlEndpoint = this.environmentService.gqlEndpoint;
    this.client = new CustomGraphQLClient(gqlEndpoint);
    this.sdk = extendedSDK(this.client);
  }

  registerInterceptor(interceptor: IResponseInterceptor): void {
    this.client.registerInterceptor(interceptor);
  }

  enableRequests(): void {
    this.client.enableRequests();
  }

  blockRequests(reason: Error | string): void {
    this.client.blockRequests(reason);
  }
}

export const graphQLService = new GraphQLService(new EnvironmentService());

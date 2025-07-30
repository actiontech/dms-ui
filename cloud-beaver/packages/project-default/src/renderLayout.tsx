/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2024 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { StrictMode, Suspense } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { DisplayError, ErrorBoundary, Loader } from '@cloudbeaver/core-blocks';
import {
  HideAppLoadingScreen,
  IServiceProvider,
  ServiceProviderContext
} from '@cloudbeaver/core-di';
import { routeTree } from './routeTree.gen';
import styles from './renderLayout.module.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import {
  LocalizationProvider,
  resources as coreResources,
  mergeLocaleResources
} from '@cloudbeaver/core-localization';
import { coreAppResources } from '@cloudbeaver/core-app';
import { coreBlocksLocaleResources } from '@cloudbeaver/core-blocks';

interface IRender {
  initRoot(): Root;
  renderApp(): void;
  renderError(exception?: any): void;
  unmount(): void;
}

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const mergedResources = mergeLocaleResources(
  coreResources,
  coreAppResources,
  coreBlocksLocaleResources
);

export function renderLayout(serviceProvider: IServiceProvider): IRender {
  let root: Root | undefined;

  return {
    initRoot(): Root {
      this.unmount();
      let container = document.body.querySelector<HTMLDivElement>('div#root');
      if (!container) {
        container = document.createElement('div');
        container.id = 'root';

        document.body.prepend(container);
      }

      root = createRoot(container);

      return root;
    },
    unmount() {
      if (root) {
        root.unmount();
        root = undefined;
      }
    },
    renderApp() {
      this.initRoot().render(
        <StrictMode>
          <LocalizationProvider resources={mergedResources}>
            <ErrorBoundary fallback={<HideAppLoadingScreen />} simple>
              <ServiceProviderContext serviceProvider={serviceProvider}>
                <ErrorBoundary fallback={<HideAppLoadingScreen />} root>
                  <Suspense
                    fallback={
                      <Loader className={s(styles, { loader: true })} />
                    }
                  >
                    <RouterProvider router={router} />
                    <HideAppLoadingScreen />
                  </Suspense>
                </ErrorBoundary>
              </ServiceProviderContext>
            </ErrorBoundary>
          </LocalizationProvider>
        </StrictMode>
      );
    },
    renderError(exception?: any) {
      if (exception) {
        console.error(exception);
      }
      this.initRoot().render(
        <StrictMode>
          <ErrorBoundary fallback={<HideAppLoadingScreen />} simple>
            <ServiceProviderContext serviceProvider={serviceProvider}>
              <DisplayError error={exception} root />
              <HideAppLoadingScreen />
            </ServiceProviderContext>
          </ErrorBoundary>
        </StrictMode>
      );
    }
  };
}

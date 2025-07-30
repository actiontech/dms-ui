import type { PluginManifest } from '@cloudbeaver/core-di';
import { coreSDKManifest } from '@cloudbeaver/core-sdk';

export const coreManifests: PluginManifest[] = [
  {
    info: {
      name: 'DBeaver core'
    },
    depends: [],

    providers: []
  },
  coreSDKManifest
];

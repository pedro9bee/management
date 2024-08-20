import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'remote-user-register',

  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

export default config;

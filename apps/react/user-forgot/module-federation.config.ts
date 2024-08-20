import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'user-forgot',

  exposes: {
    './Module': './src/remote-entry.ts',
  },
};

export default config;

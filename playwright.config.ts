// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  retries: 3,
  use: {
    trace: 'on-first-retry',
  },
};
export default config;

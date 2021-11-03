// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  // retries: 1,
  use: {
    trace: 'retain-on-failure',
  },
};
export default config;

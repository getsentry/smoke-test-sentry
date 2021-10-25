import {test, expect} from '@playwright/test';

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

test.beforeAll(() => {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
});

test('sentryio', async ({page}) => {
  const transaction = Sentry.startTransaction({
    name: "sentry.io smoke test",
  });

  Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));

  const span = transaction.startChild({
    op: "smoke-test",
    description: "run sentry.io smoke test",
  });

  try {
    // Go to https://sentry.io/
    await page.goto('https://sentry.io/');
    expect(page.url()).toBe('https://sentry.io/welcome/');

    // Click text=I Accept
    await page.click('text=I Accept');

    // Click a:has-text("Sign In")
    await page.click('a:has-text("Sign In")');
    await page.waitForURL('https://sentry.io/auth/login/');

    // Click text=Single Sign-On
    await page.click('a[href="#sso"]');

    // Click [placeholder="acme"]
    await page.click('[placeholder="acme"]');

    // Fill [placeholder="acme"]
    await page.fill('[placeholder="acme"]', 'sentry');

    // Click #sso >> text=Continue
    await page.click('#sso >> text=Continue');
    expect(page.url()).toBe('https://sentry.io/auth/login/sentry/');

    // Click text=Login with Google
    await page.click('text=Login with Google');
    await page.waitForURL('https://accounts.google.com/**/*');

    // Go back to login
    await page.goto('https://sentry.io/auth/login/');

    // Login with smoke test account
    await page.fill('[name="username"]', process.env.SENTRY_SMOKE_USER);
    await page.fill('[name="password"]', process.env.SENTRY_SMOKE_PASSWORD);
    await page.click('button[type="submit"] >> text=Continue');

    await expect(page.locator('h1 >> text=Issues').first()).toBeVisible();

    // Close page
    await page.close();
    span.setStatus(Tracing.SpanStatus.Ok);
  } catch (err) {
    span.setStatus(Tracing.SpanStatus.InternalError);
    Sentry.captureException(err);
    throw err;
  } finally {
    span.finish();
    transaction.finish();
  }
});

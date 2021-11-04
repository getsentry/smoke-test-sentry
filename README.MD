# smoke-test-sentry

Smoke tests for https://sentry.io using [playwright](https://playwright.dev/).
There is currently a single test to log into Sentry's web application and
ensure that the frontend loads properly.


## Running

```bash
npm install && npx playwright install
npm test
```

### Running in headed mode

Sometimes it's useful to see what is being rendered in the browser. In this case we need to run in non-headless mode, or `headed`.
```bash
npm test -- --headed
```

## Development

If you'd like to get started, see the [playwright](https://playwright.dev/)
docs. They have many tools to aid in writing, generating, and debugging tests
([inspector](https://playwright.dev/docs/inspector),
[codegen](https://playwright.dev/docs/codegen),
[debug](https://playwright.dev/docs/debug))

## Flakiness
If you are trying to debug some intermittent issues with the tests, we use GHA to save a trace when a smoke test run fails. Navigate to a failed job and download the trace artifact. You can then run `npx playwright show-trace trace.zip` (https://playwright.dev/docs/trace-viewer#viewing-the-trace) to open the trace to debug.

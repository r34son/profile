# Playwright

## Screenshots

<!-- https://github.com/microsoft/playwright/issues/7575#issuecomment-882376002 -->

To update screenshots on mac follow this steps:

```bash
docker run -it --rm --ipc=host -v $(pwd):/work/ -w /work/ mcr.microsoft.com/playwright:v1.45.1-jammy /bin/bash
```

```bash
# inside container with running app on localhost
npm install
PLAYWRIGHT_TEST_BASE_URL=http://host.docker.internal:3000 npx playwright test --update-snapshots --trace on
```

Opening the HTML report

```bash
npx playwright show-report
```

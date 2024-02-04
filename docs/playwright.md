# Playwright

## Screenshots

To update screenshots on mac follow this steps:

```bash
docker run --rm --network host -v $(pwd):/work/ -w /work/ -it mcr.microsoft.com/playwright:v1.41.2-jammy /bin/bash
```

```bash
# inside container with running app on localhost
npm install
PLAYWRIGHT_TEST_BASE_URL=http://host.docker.internal:3000 npx playwright test --update-snapshots
```

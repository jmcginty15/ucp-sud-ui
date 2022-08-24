# ucp-sud-ui

## Development

Create an `.env` file at the root of the project:

```
SESSION_SECRET=08720789-7333-428b-98f0-a9033eacf451
API_BASE_URL=http://localhost:8070
```

The value of `SESSION_SECRET` is arbitrary. The value of `API_BASE_URL` must match the backend API.

Then:

```sh
npm run dev
```

This starts the app in development mode, rebuilding assets on file changes.

## Deployment

First, build the app for production:

```sh
npm run build
```

To run the app in production mode:

```sh
npm start
```

## Overview

The app is built using [Remix](https://remix.run/docs) and is written in TypeScript. Remix provides facilities around key areas such as routing and data reads/writes.

### Folder Structure

```
├── app
│   ├── components # Shared components
│   ├── icons
│   ├── routes # See https://remix.run/docs/en/v1/guides/routing. By convention, each route has a CSS file alongside with the same name, unless it's a [resource route](https://remix.run/docs/en/v1/guides/resource-routes). Separated into `__private` and `__public` for routes that do and do not require authentication.
│   ├── sdk # Generated TypeScript SDK for backend API
│   ├── styles # Global styles go here
│   └── utils # Shared utilities. [Server-only](https://remix.run/docs/en/v1/guides/constraints#server-code-pruning) utilities are prepended with `.server` before the extension.
└── public # Static assets such as favicon and logos
```

### SDK

The app uses a TypeScript SDK generated from the OpenAPI spec of the backend API. The SDK allows the app to do typed data reads and writes. The generated SDK is instantiated in `app/sdk.ts`, and this instance is used throughout the app.

#### SDK Generation

To regenerate the SDK, run:

```sh
npm run gen-sdk
```

If successful, the SDK is generated inside the folder `app/sdk`.

Because this process makes a request to the backend, the backend must be running. By default, the script expects the backend to be running on port 8070. If the port is different, you can run:

```sh
PORT=MY_PORT npm run gen-sdk
```

The SDK is typically regenerated when there's been an externally visible API change.

import {
  type LinksFunction,
  type MetaFunction,
  type LoaderFunction,
  json,
} from "@remix-run/node";
import {
  useLoaderData,
  ScrollRestoration,
  Links,
  LiveReload,
  Outlet,
  useCatch,
  Meta,
  Scripts,
} from "@remix-run/react";
import uiLibStyles from "@cl-privacy/components/styles.css";
import stylesFlashMessage from "@cl-privacy/components/flash-message/styles.css";
import globalStylesUrl from "./styles/global.css";
import { formatTitle } from "./utils/formatTitle";
import { appName } from "./utils/appName";
import {
  type TFlashMessage,
  getFlashMessage,
  getSession,
  commitSession,
} from "./utils/session.server";
import {
  AuthenticityTokenProvider,
  createAuthenticityToken,
} from "remix-utils";
import { NotFound, links as linksNotFound } from "./components/404";
import {
  ErrorScreen,
  links as linksErrorScreen,
} from "./components/ErrorScreen";
import { FlashMessageProvider } from "./utils/useFlashMessage";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap",
    },
    { rel: "stylesheet", href: uiLibStyles },
    { rel: "stylesheet", href: stylesFlashMessage },
    { rel: "stylesheet", href: globalStylesUrl },
    ...linksNotFound(),
    ...linksErrorScreen(),
  ];
};

export const meta: MetaFunction = () => {
  return {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
    description: "Privacy dashboard",
    keywords: "dashboard,privacy",
  };
};

type LoaderData = { csrf: string; flashMessage: TFlashMessage };

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const flashMessage = getFlashMessage(session);
  const csrf = createAuthenticityToken(session);
  const data: LoaderData = { csrf, flashMessage };
  return json(data, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <Document title="Not Found" flashMessage={null}>
        <NotFound />
      </Document>
    );
  }

  return (
    <Document
      title={`${caught.status} ${caught.statusText}`}
      flashMessage={null}
    >
      <ErrorScreen message={`${caught.status} ${caught.statusText}`} />
    </Document>
  );
}

export function ErrorBoundary(props: { error: Error }) {
  const { error } = props;
  console.error(error);

  return (
    <Document title="Uh-oh!" flashMessage={null}>
      <ErrorScreen message={"Something went wrong. Sorry about that."} />
    </Document>
  );
}

export default function App() {
  const { csrf, flashMessage } = useLoaderData<LoaderData>();

  return (
    <AuthenticityTokenProvider token={csrf}>
      <Document flashMessage={flashMessage}>
        <Outlet />
      </Document>
    </AuthenticityTokenProvider>
  );
}

function Document(props: {
  children: React.ReactNode;
  title?: string;
  flashMessage: TFlashMessage;
}) {
  const { children, title } = props;
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title ? formatTitle(title) : appName}</title>
        <Links />
      </head>
      <body>
        <FlashMessageProvider flashMessage={props.flashMessage}>
          {children}
        </FlashMessageProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

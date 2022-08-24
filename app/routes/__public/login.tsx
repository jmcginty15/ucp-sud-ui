import {
  type ActionFunction,
  type LinksFunction,
  type MetaFunction,
  type LoaderFunction,
  json
} from "@remix-run/node";
import {
  useTransition,
  useActionData,
  useSearchParams,
  Form
} from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { formatTitle } from "~/utils/formatTitle";
import styles from "./login.css";
import { Button } from "@cl-privacy/components/button";
import stylesButton from "@cl-privacy/components/button/styles.css";
import { Input } from "@cl-privacy/components/input";
import stylesInput from "@cl-privacy/components/input/styles.css";
import { appName } from "~/utils/appName";
import logo from "../../../public/CLP-logos/CLP-logos_transparent.png";
import { Alert } from "@cl-privacy/components/alert";
import stylesAlert from "@cl-privacy/components/alert/styles.css";
import { authenticator } from "~/utils/auth.server";
import { messageGeneric } from "~/utils/strings.server";
import { safeJsonParse } from "~/utils/safeJsonParse";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: stylesButton },
    { rel: "stylesheet", href: stylesInput },
    { rel: "stylesheet", href: stylesAlert }
  ];
};

export const meta: MetaFunction = () => {
  return { title: formatTitle("Sign In") };
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string;
    password: string;
  };
};

export let action: ActionFunction = async ({ request }) => {
  try {
    return await authenticator.authenticate("form", request, {
      successRedirect: "/",
      throwOnError: true
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    if (error instanceof AuthorizationError) {
      return json(
        safeJsonParse(error.message) ?? { formError: messageGeneric },
        { status: 401 }
      );
    }
    return json({ formError: messageGeneric }, { status: 401 });
  }
};

export let loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/"
  });
};

export default function Route() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();
  const [searchParams] = useSearchParams();
  return (
    <div className="login">
      <img src={logo} alt={appName} />
      <h1>Sign In to Your Account</h1>
      <Form method="post">
        <div>
          {actionData?.formError ? <Alert>{actionData.formError}</Alert> : null}
        </div>
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") ?? undefined}
        />
        <div className="fields">
          <Input
            error={actionData?.fieldErrors?.username}
            name="username"
            defaultValue={actionData?.fields?.username}
            placeholder="Username"
          />
          <Input
            error={actionData?.fieldErrors?.password}
            type="password"
            name="password"
            defaultValue={actionData?.fields?.password}
            placeholder="Password"
          />
        </div>
        <div>
          <Button
            className="createPolicyButton"
            type="submit"
            state={transition.state !== "idle" ? "pending" : undefined}>
            Sign In
          </Button>
        </div>
      </Form>
    </div>
  );
}

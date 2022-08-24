import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sdk, setCacheItem } from "~/sdk";
import { mapValidationErrors } from "./mapValidationErrors.server";
import { sessionStorage } from "./session.server";
import { type User } from "./User.server";

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("username");
    const password = form.get("password");
    const redirectTo = form.get("redirectTo") || "/";

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof redirectTo !== "string"
    ) {
      throw new Error(
        JSON.stringify({ formError: `Form not submitted correctly.` })
      );
    }

    const fields = { username, password };

    const formErrorFallback = "Something went wrong. Please try again.";

    const resData = await sdk.loginUser({ data: fields, interceptors: {} });

    if (resData.ok) {
      const user = resData.body.user;
      const userUuid = user.uuid;
      const accessToken = resData.body.token;
      const refreshToken = resData.body.refresh_token;
      setCacheItem(userUuid, { accessToken, refreshToken });
      return user;
    }
    if (resData.status === 422) {
      const fieldErrors: any = mapValidationErrors(
        // TODO
        (resData as any)?.body?.error?.validationErrors
      );
      // TODO: there's probably a better way than JSON.stringifying.
      throw new Error(JSON.stringify({ fieldErrors, fields }));
    }
    if ((resData as any).status === 401) {
      const formError = (resData as any)?.body?.detail;
      throw new Error(JSON.stringify({ formError, fields }));
    }

    throw new Error(JSON.stringify({ formError: formErrorFallback }));
  })
);

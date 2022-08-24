import { type ActionFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export let action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};

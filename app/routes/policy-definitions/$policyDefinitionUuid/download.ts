import { json, type LoaderFunction } from "@remix-run/node";
import { getInterceptors, sdk } from "~/sdk";
import { authenticator } from "~/utils/auth.server";
import { _401 } from "~/utils/strings.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request);

  if (user == null) {
    return json({ message: _401 }, { status: 401 });
  }

  const policyDefinitionUuid = params.policyDefinitionUuid;

  if (typeof policyDefinitionUuid !== "string") {
    return json(
      { message: "Invalid policy definition UUID." },
      { status: 400 }
    );
  }

  return sdk.getPolicyDefinitionDownload({
    params: { policy_definition_uuid: policyDefinitionUuid },
    interceptors: await getInterceptors(request),
  });
};

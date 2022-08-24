import * as React from "react";
import {
  type LoaderFunction,
  type LinksFunction,
  type ActionFunction,
  redirect
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useSearchParams,
  useTransition
} from "@remix-run/react";
import { type ResBody200GetPolicyDefinition } from "~/sdk/Sdk";
import { getAccessToken, getInterceptors, sdk } from "~/sdk";
import {
  commitSession,
  flashMessage,
  getSession
} from "~/utils/session.server";
import { IconCloudDownload } from "~/icons/IconCloudDownload";
import { authenticator } from "~/utils/auth.server";
import { messageGeneric, _401 } from "~/utils/strings.server";
import useMedia from "react-use/lib/useMedia";
import { useFlashMessage } from "~/utils/useFlashMessage";
import { Table, TableActionsContainer, TColumn } from "~/components/Table";
import { useNavigate } from "@remix-run/react";
import { Button } from "@cl-privacy/components/button";
import { Link } from "@remix-run/react";
import { IconAdd } from "~/icons/IconAdd";
import styles from "./index.css";
import { Heading } from "~/components/Heading";
import stylesHeading from "~/components/Heading.css";
import { Input } from "@cl-privacy/components/input";
import stylesInput from "@cl-privacy/components/input/styles.css";
import { CopyBlock, obsidian } from "react-code-blocks";
import { FormControlLayout } from "../privacy-policy/$policyUuid";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: stylesHeading },
    { rel: "stylesheet", href: stylesInput }
  ];
};

const formIdUpdatePublicUrl = "form-update-public-url";
const labelIdName = "pd-name";

const awsLink = "https://aws.amazon.com/";
const gcpLink = "https://cloud.google.com/";
const digitalOceanLink = "https://www.digitalocean.com/";

type LoaderData = {
  privacyPolicy: {
    publicUrl: string | null;
    name: string | null;
  };
};
type TValueMap = Map<string, any>;
const searchParamKeyActionSuccess = "s";

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login"
  });

  // let out = {
  //   policyDefinition: await sdk
  //     .getPolicyDefinitionList({
  //       interceptors: await getInterceptors(request)
  //     })
  //     .then((x) =>
  //       !x?.ok ? null : (x.body?.results?.[0] as LoaderData["policyDefinition"])
  //     )
  // };

  const out = {
    privacyPolicy: await sdk
      .getPolicyDefinition({
        params: { policy_definition_uuid: params.policyUuid || "" },
        interceptors: await getInterceptors(request)
      })
      .then((x) =>
        !x?.ok
          ? null
          : ({
              publicUrl: x.body.publicUrl,
              name: x.body.name,
              uuid: params.policyUuid
            } as LoaderData["privacyPolicy"])
      )
  };

  return out;
};

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  // await verifyAuthenticityToken(request, session);

  const user = await authenticator.isAuthenticated(request);

  const url = new URL(request.url);
  let redirectTo = url.pathname + url.search;

  if (user == null) {
    flashMessage(_401, "error", session);
    return redirect(redirectTo, {
      status: 401,
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  const formData = await request.formData();
  const publicUrl = formData.get("publicUrl");
  const policyName = formData.get("policyName");

  if (typeof publicUrl !== "string" || typeof policyName !== "string") {
    flashMessage(`Missing required information.`, "error", session);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  const resData = await sdk.updatePolicyDefinition({
    params: { policy_definition_uuid: params.policyUuid || "" },
    data: { schemaVersion: 1, publicUrl, name: policyName || "" },
    interceptors: await getInterceptors(request)
  });

  if (!resData.ok) {
    flashMessage(messageGeneric, "error", session);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  url.searchParams.set(searchParamKeyActionSuccess, "1");
  redirectTo = "/";
  // redirectTo = url.pathname + url.search;
  flashMessage("Done!", "success", session);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await commitSession(session) }
  });
};

export default function Route() {
  const data = useLoaderData();
  const navigate = useNavigate();
  const [publicUrl, setPublicUrl] = React.useState(
    data.privacyPolicy.publicUrl || ""
  );
  const policyName = data.privacyPolicy.name;
  const transition = useTransition();

  return (
    <div>
      <div className="privacyProfileSection">
        <header>
          <div>
            <Heading as="h1">Share your Privacy Policy</Heading>
            <Button
              as="a"
              href={`/policy-definitions/${data.privacyPolicy.uuid}/download`}
              download
              icon={{ icon: <IconCloudDownload /> }}
              variant="neutral"
              size="xxs">
              Export
            </Button>
          </div>
          <p>
            You can host your policy either (1) with a third-party service or
            (2) on your own server.
          </p>
          <p>
            First, download your policy using the Export button above and host
            it with your method of choice. Then, once your policy is hosted,
            paste the URL here and submit to update it in the broker.
          </p>
          <Form
            className="publicUrlContainer"
            id={formIdUpdatePublicUrl}
            method="post"
            replace>
            <Input
              type="hidden"
              form={formIdUpdatePublicUrl}
              name="policyName"
              value={policyName}
            />
            <Input
              required
              id={labelIdName}
              form={formIdUpdatePublicUrl}
              value={publicUrl}
              onChange={(event) => setPublicUrl(event.target.value)}
              name="publicUrl"
              placeholder="Your policy's public URL..."
            />
            <Button
              id="publicUrl-submit-button"
              className="bodyButton"
              type="submit"
              form={formIdUpdatePublicUrl}
              state={transition.state === "submitting" ? "pending" : undefined}>
              Submit
            </Button>
          </Form>
        </header>
      </div>
      <div className="privacyProfileSection">
        <header>
          <Heading as="h1">Host with a Third Party Service</Heading>
          <p>
            One option for hosting your policy is to use a cloud storage
            platform such as AWS or GCP, then just give us the public URL so the
            broker will know where to find your policy. We've provided links to
            the documentation of a few different services here to get you
            started, but you could also use other services if desired.
          </p>
          {/* <div className="buttonContainer">
            <Button
              className="bodyButton"
              type="button"
              size="sm"
              onClick={() => console.log("butthole")}>
              Host Your Own
            </Button>
            <Button
              className="bodyButton"
              type="button"
              size="sm"
              onClick={() => console.log("butthole")}>
              Host Here
            </Button>
          </div> */}
          <div>
            <a
              className="createPolicyLinkReg"
              href={awsLink}
              target="_blank"
              rel="noreferrer">
              Host with AWS
            </a>
            |
            <a
              className="createPolicyLinkReg"
              href={gcpLink}
              target="_blank"
              rel="noreferrer">
              Host with GCP
            </a>
            |
            <a
              className="createPolicyLinkReg"
              href={digitalOceanLink}
              target="_blank"
              rel="noreferrer">
              Host with Digital Ocean
            </a>
          </div>
        </header>
      </div>
      <div className="privacyProfileSection">
        <header>
          <Heading as="h1">Host Manually via Docker</Heading>
          <p>
            One option for hosting your policy on your own server is to set up a
            Docker container. This assumes you know how to deploy a docker
            container to various systems such as on a Virtual Machine or
            Kubernetes.
          </p>
          <p>
            The <b>Provider Privacy Manager</b> can be retrieved from{" "}
            <a
              className="createPolicyLinkColored"
              href="https://hub.docker.com/"
              target="_blank"
              rel="noreferrer">
              Docker Hub
            </a>{" "}
            as an image:{" "}
            <a
              className="createPolicyLinkColored"
              href="https://hub.docker.com/provider-privacy-manager"
              target="_blank"
              rel="noreferrer">
              https://hub.docker.com/provider-privacy-manager
            </a>{" "}
            or on the command line:
          </p>
          <div className="codeBlock">
            <CopyBlock
              text="docker pull provider-privacy-manager:latest"
              theme={obsidian}
              showLineNumbers={false}
              codeBlock
            />
          </div>
          <p>
            Once retrieved, start the privacy manager with the appropriate ports
            for your infrastructure. If you would like the manager to generate
            TLS certificates using LetsEncrypt,{" "}
            <a
              className="createPolicyLinkColored"
              href="https://letsencrypt.org/docs/"
              target="_blank"
              rel="noreferrer">
              see the various options
            </a>{" "}
            for doing so via environment variables.
          </p>
          <div className="codeBlock">
            <CopyBlock
              text="docker run -d -p 80:8000 -p 9091:9090 -e BROKER_API_TOKEN afifjj393902 provider-privacy-manager"
              theme={obsidian}
              showLineNumbers={false}
              codeBlock
            />
          </div>
          <p>
            Once running, visit the management webpage provided by the manager
            at{" "}
            <a
              className="createPolicyLinkColored"
              href="http://localhost:9091"
              target="_blank"
              rel="noreferrer">
              http://localhost:9091
            </a>{" "}
            or at the URL where it is deployed.
          </p>
        </header>
      </div>
    </div>
  );
}

function getValueName(input: {
  dataTypeEnum: string;
  dataElementEnum: string;
  attributeTypeEnum: string;
}) {
  const { dataTypeEnum, dataElementEnum, attributeTypeEnum } = input;
  const separator = "___$$___";
  return [dataTypeEnum, dataElementEnum, attributeTypeEnum].join(separator);
}

function getValueMap(
  policy: null | undefined,
  initialValueMap?: TValueMap,
  filterDataTypeEnums?: (x: string) => boolean
): TValueMap {
  const valueMap: TValueMap = initialValueMap ?? new Map();
  if (policy == null) {
    return valueMap;
  }
  let keys = Object.keys(policy);
  if (typeof filterDataTypeEnums === "function") {
    keys = keys.filter(filterDataTypeEnums);
  }
  for (let dataTypeEnum of keys) {
    const x: any = policy[dataTypeEnum];
    const dataElementList = x?.dataElementList ?? [];
    const attributeTypeList = x?.attributeTypeList ?? [];
    for (let dataElement of dataElementList) {
      const dataElementEnum = dataElement.enum;
      const attributeList = dataElement.attributeList;
      for (let attributeType of attributeTypeList) {
        const attribute = attributeList.find(
          (a: any) => a.attributeTypeEnum === attributeType.enum
        );
        if (attribute == null) {
          continue;
        }
        const attributeTypeEnum = attribute.attributeTypeEnum;
        const key = getValueName({
          dataTypeEnum,
          dataElementEnum,
          attributeTypeEnum
        });
        const value = attribute?.attributeTypeValueEnum ?? attribute?.value;
        if (attributeType?.jsonSchema?.type === "boolean") {
          valueMap.set(key, value === "TRUE");
        } else {
          valueMap.set(key, value);
        }
      }
    }
  }
  return valueMap;
}

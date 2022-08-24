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
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TabsOrientation
} from "@reach/tabs";
import stylesTabs from "@reach/tabs/styles.css";
import { getInterceptors, sdk } from "~/sdk";
import { authenticator } from "~/utils/auth.server";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel
} from "@reach/accordion";
import stylesAccordion from "@reach/accordion/styles.css";
import {
  SliderInput,
  SliderTrack,
  SliderRange,
  SliderHandle,
  SliderMarker
} from "@reach/slider";
import stylesSlider from "@reach/slider/styles.css";
import { Input } from "@cl-privacy/components/input";
import stylesInput from "@cl-privacy/components/input/styles.css";
import { Checkbox } from "@cl-privacy/components/checkbox";
import stylesCheckbox from "@cl-privacy/components/checkbox/styles.css";
import { Pressable } from "@cl-privacy/components/pressable";
import stylesPressable from "@cl-privacy/components/pressable/styles.css";
import { Table, TableActionsContainer, TColumn } from "~/components/Table";
import stylesTable from "~/components/Table.css";
import { type ResBody200GetPolicyDefinitionList } from "~/sdk/Sdk";
import { Button } from "@cl-privacy/components/button";
import stylesButton from "@cl-privacy/components/button/styles.css";
import styles from "./index.css";
import { Heading } from "~/components/Heading";
import stylesHeading from "~/components/Heading.css";
import { promiseHash } from "remix-utils";
import { capitalCase, sentenceCase } from "change-case";
import {
  commitSession,
  flashMessage,
  getSession
} from "~/utils/session.server";
import { messageGeneric, _401 } from "~/utils/strings.server";
import {
  PolicyTemplateSelectable,
  links as linksPolicyTemplateSelectable
} from "~/components/PolicyTemplateSelectable";
// https://github.com/streamich/react-use/issues/2074
import useMedia from "react-use/lib/useMedia";
import { Link } from "@remix-run/react";
import { IconCloudDownload } from "~/icons/IconCloudDownload";
import { IconCheckCircle } from "~/icons/IconCheckCircle";
import { IconEdit } from "~/icons/IconEdit";
import { IconDelete } from "~/icons/IconDelete";
import { useFlashMessage } from "~/utils/useFlashMessage";
import cloneDeep from "lodash.clonedeep";
import ColorHash from "color-hash-ts";
import { IconAdd } from "~/icons/IconAdd";
import { useNavigate } from "@remix-run/react";
import { Tooltip } from "@cl-privacy/components/tooltip";
import { ToggleSwitch } from "~/components/ToggleSwitch";
import stylesToggleSwitch from "~/components/ToggleSwitch.css";

const formIdCreatePolicyDefinition = "form-create-policy-definition";

// Meh. Kind of a hack to close dialogs upon action success.
const searchParamKeyActionSuccess = "s";

const colorHash = new ColorHash();

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesTable },
    { rel: "stylesheet", href: stylesTabs },
    { rel: "stylesheet", href: stylesInput },
    { rel: "stylesheet", href: stylesCheckbox },
    { rel: "stylesheet", href: stylesPressable },
    { rel: "stylesheet", href: stylesSlider },
    { rel: "stylesheet", href: stylesAccordion },
    { rel: "stylesheet", href: stylesHeading },
    { rel: "stylesheet", href: stylesButton },
    { rel: "stylesheet", href: stylesToggleSwitch },
    { rel: "stylesheet", href: styles },
    ...linksPolicyTemplateSelectable()
  ];
};

type Policy = {
  uuid: string;
  name: string;
  publicUrl: string;
  active: boolean;
};

// type LoaderData = {
//   policyList: string;
// };

type LoaderData = {
  policies: ResBody200GetPolicyDefinitionList;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login"
  });

  const res = await sdk.getPolicyDefinitionList({
    interceptors: await getInterceptors(request)
  });

  return { policies: res.body };
};

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const url = new URL(request.url);
  let redirectTo = url.pathname + url.search;

  const formData = await request.formData();
  const policyUuid = formData.get("policyUuid");
  const toggleState = formData.get("toggleState");
  const policyName = formData.get("policyName");

  if (typeof policyUuid !== "string") {
    flashMessage(`Missing required information.`, "error", session);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  if (policyName === null) {
    const resData = await sdk.deletePolicyDefinition({
      params: { policy_definition_uuid: policyUuid || "" },
      interceptors: await getInterceptors(request)
    });

    if (!resData.ok) {
      flashMessage(messageGeneric, "error", session);
      return redirect(redirectTo, {
        headers: { "Set-Cookie": await commitSession(session) }
      });
    }

    flashMessage("Done!", "success", session);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  } else {
    if (typeof policyName !== "string") {
      flashMessage(`Missing required information.`, "error", session);
      return redirect(redirectTo, {
        headers: { "Set-Cookie": await commitSession(session) }
      });
    }

    const resData = await sdk.updatePolicyDefinition({
      params: { policy_definition_uuid: policyUuid || "" },
      data: {
        schemaVersion: 1,
        active: toggleState === "on" ? true : false,
        name: policyName || ""
      },
      interceptors: await getInterceptors(request)
    });

    if (!resData.ok) {
      flashMessage(messageGeneric, "error", session);
      return redirect(redirectTo, {
        headers: { "Set-Cookie": await commitSession(session) }
      });
    }

    flashMessage("Done!", "success", session);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }
};

type TValueMap = Map<string, any>;

export default function Route() {
  const list = useLoaderData<LoaderData>().policies.results;
  const toggleFormRef = React.useRef<HTMLFormElement>(null);

  const handleToggle = () => {
    toggleFormRef.current?.submit();
  };

  const columns: TColumn<typeof list[number]>[] = [
    {
      heading: "Name",
      dataPath: "name",
      width: "30%"
      // ordering: { key: "name" }
    },
    {
      heading: "Public URL",
      dataPath: "publicUrl",
      width: "35%"
      // ordering: { key: "publicUrl" }
    },
    {
      heading: "Active",
      render: (rowData: any) => {
        return (
          <Form
            className="toggleForm"
            ref={toggleFormRef}
            id={`${rowData.uuid}-toggle`}
            method="post"
            replace>
            <Input
              name="policyName"
              value={rowData.name}
              form={`${rowData.uuid}-toggle`}
              readOnly
              type="hidden"
            />
            <Input
              name="policyUuid"
              value={rowData.uuid}
              form={`${rowData.uuid}-toggle`}
              readOnly
              type="hidden"
            />
            <ToggleSwitch
              name="toggleState"
              isOn={rowData.active}
              handleToggle={handleToggle}
              formId={`${rowData.uuid}-toggle`}
            />
          </Form>
        );
        // return rowData.active ? "Yes" : "No";
      },
      width: "25%"
      // ordering: { key: "active" }
    },
    {
      heading: "",
      render: (rowData: any) => {
        return (
          <Button
            className="iconContainer editButton"
            onClick={() =>
              navigate(`/privacy-policy/${rowData.uuid}`, {
                replace: false
              })
            }>
            <IconEdit />
          </Button>
        );
      },
      width: "auto"
    },
    {
      heading: "",
      render: (rowData: any) => {
        return (
          <Form id={`${rowData.uuid}-delete`} method="post" replace>
            <Input
              name="policyUuid"
              value={rowData.uuid}
              form={`${rowData.uuid}-delete`}
              readOnly
              type="hidden"
            />
            <Button
              form={`${rowData.uuid}-delete`}
              className="iconContainer deleteButton"
              type="submit">
              <IconDelete />
            </Button>
          </Form>
        );
      },
      width: "auto"
    }
  ];

  const navigate = useNavigate();

  return (
    <div>
      <div className="privacyProfileTable">
        <header>
          <div>
            <Heading as="h1">Privacy Policies</Heading>
            <Button
              className="bodyButton"
              type="button"
              size="sm"
              onClick={() =>
                navigate("/privacy-policy/create", { replace: false })
              }>
              <IconAdd size={30} /> New Policy
            </Button>
          </div>
        </header>
        <div className="privacyProfileTableContainer">
          <Table columns={columns} data={list} />
        </div>
      </div>
    </div>
  );
}

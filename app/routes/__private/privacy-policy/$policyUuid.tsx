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
import { getAccessToken, getInterceptors, sdk } from "~/sdk";
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
import { type ResBody200GetPolicyDefinitionList } from "~/sdk/Sdk";
import { Button } from "@cl-privacy/components/button";
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
import { IconCloudDownload } from "~/icons/IconCloudDownload";
import { useFlashMessage } from "~/utils/useFlashMessage";
import cloneDeep from "lodash.clonedeep";
import ColorHash from "color-hash-ts";
import { blankTemplate, attributeList } from "./blankTemplate";

const formIdCreatePolicyDefinition = "form-create-policy-definition";

// Meh. Kind of a hack to close dialogs upon action success.
const searchParamKeyActionSuccess = "s";

const colorHash = new ColorHash();

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesTabs },
    { rel: "stylesheet", href: stylesInput },
    { rel: "stylesheet", href: stylesCheckbox },
    { rel: "stylesheet", href: stylesPressable },
    { rel: "stylesheet", href: stylesSlider },
    { rel: "stylesheet", href: stylesAccordion },
    { rel: "stylesheet", href: stylesHeading },
    { rel: "stylesheet", href: styles },
    ...linksPolicyTemplateSelectable()
  ];
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
  const policyDefinitionUuid = formData.get("policyDefinitionUuid");
  const name = formData.get("name");

  if (typeof name !== "string") {
    flashMessage(`Missing required information.`, "error", session);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  if (
    policyDefinitionUuid != null &&
    typeof policyDefinitionUuid !== "string"
  ) {
    flashMessage(`Invalid input provided.`, "error", session);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  if (blankTemplate == null) {
    flashMessage(`Invalid policy template.`, "error", session);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  let policy: any = cloneDeep(blankTemplate);
  for (let k in policy) {
    const attributeTypeList = policy[k]?.attributeTypeList;
    if (Array.isArray(policy?.[k]?.dataElementList)) {
      for (let dataElement of policy[k].dataElementList) {
        if (Array.isArray(dataElement?.attributeList)) {
          for (let attribute of dataElement.attributeList) {
            const attributeType = attributeTypeList?.find?.(
              (at: any) => at.enum === attribute.attributeTypeEnum
            );
            if (attributeType == null) {
              continue;
            }
            const dataElementEnum = dataElement.enum;
            const dataTypeEnum = dataElement.dataTypeEnum;
            const jsonSchema = attributeType.jsonSchema;
            const key = getValueName({
              dataTypeEnum,
              dataElementEnum,
              attributeTypeEnum: attributeType.enum
            });
            const formValue = formData.get(key);
            if (jsonSchema?.type === "boolean") {
              if (formValue == null) {
                attribute.attributeTypeValueEnum = "FALSE";
              } else {
                attribute.attributeTypeValueEnum = "TRUE";
              }
            } else {
              const attributeTypeValueList = attribute.attributeTypeValueList;
              if (
                Array.isArray(attributeTypeValueList) &&
                attributeTypeValueList.some((atv) => atv.enum === formValue)
              ) {
                attribute.attributeTypeValueEnum = formValue;
              } else {
                attribute.value = formValue;
              }
            }
          }
        }
      }
    }
  }

  const resData =
    typeof policyDefinitionUuid === "string"
      ? await sdk.updatePolicyDefinition({
          params: { policy_definition_uuid: policyDefinitionUuid },
          data: {
            name,
            schemaVersion: 1,
            privacyPolicy: {
              policy
              // TODO?
            }
          },
          interceptors: await getInterceptors(request)
        })
      : await sdk.createPolicyDefinition({
          data: {
            name,
            schemaVersion: 1,
            privacyPolicy: {
              policy
              // TODO?
            }
          },
          interceptors: await getInterceptors(request)
        });

  if (!resData.ok) {
    flashMessage(messageGeneric, "error", session);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  url.searchParams.set(searchParamKeyActionSuccess, "1");
  redirectTo = `/host-privacy-policy/${resData.body.uuid}`;
  // redirectTo = url.pathname + url.search;
  // flashMessage("Done!", "success", session);
  return redirect(redirectTo, {
    headers: { "Set-Cookie": await commitSession(session) }
  });
};

const labelIdName = "pd-name";

type LoaderData = {
  policyDefinition: ResBody200GetPolicyDefinitionList["results"][number] | null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login"
  });

  if (params.policyUuid === "create") return { policyDefinition: undefined };

  const out = {
    policyDefinition: await sdk
      .getPolicyDefinitionList({
        interceptors: await getInterceptors(request)
      })
      .then((x) => {
        if (!x?.ok) return null;

        for (let result of x.body?.results) {
          if (result.uuid === params.policyUuid)
            return result as LoaderData["policyDefinition"];
        }

        return null;
      })
  };

  return out;
};

type TValueMap = Map<string, any>;

export default function Route() {
  const data = useLoaderData<LoaderData>();

  const policyDefinition = data.policyDefinition;

  const isWide = useMedia("(min-width: 1024px)", true);
  const transition = useTransition();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [name, setName] = React.useState(policyDefinition?.name || "");
  const [isFirstStepComplete, setIsFirstStepComplete] = React.useState(false);

  const [valueMap, setValueMap] = React.useState<TValueMap>(
    getValueMap((policyDefinition?.privacyPolicy as any)?.policy)
  );

  const { setFlashMessage } = useFlashMessage();

  const [searchParams, setSearchParams] = useSearchParams();
  const isSubmitting = transition.state === "submitting";
  React.useEffect(() => {
    if (!isSubmitting && searchParams.get(searchParamKeyActionSuccess)) {
      setStepIndex(0);
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.delete(searchParamKeyActionSuccess);
      setSearchParams(nextSearchParams, { replace: true });
      setFlashMessage({ message: "Done!", type: "success" });
    }
  }, [isSubmitting, searchParams, setSearchParams, setFlashMessage]);

  return (
    <div className="privacyProfileCreate">
      <header>
        <div>
          <Heading as="h1">
            {policyDefinition ? "Update" : "Create"} Your Privacy Profile
          </Heading>
          {policyDefinition ? (
            <Button
              as="a"
              href={`/policy-definitions/${policyDefinition.uuid}/download`}
              download
              icon={{ icon: <IconCloudDownload /> }}
              variant="neutral"
              size="xxs">
              Export
            </Button>
          ) : null}
        </div>
        <p>
          Define your own privacy profile around what data your service shares,
          and what data it keeps private.
        </p>
      </header>
      <Accordion
        index={stepIndex}
        onChange={(value) => setStepIndex(value ?? 0)}>
        <AccordionItem>
          <AccordionItemHeader text="Basic Info" index={1} />
          <AccordionPanel>
            <div className="sections">
              <div>
                <FormControlLayout
                  text={<label htmlFor={labelIdName}>Policy Name</label>}
                  description={
                    <p>
                      This can be anything you want. It will be used to provide
                      an identifier for your specific policy.
                    </p>
                  }>
                  <div>
                    <Input
                      required
                      id={labelIdName}
                      form={formIdCreatePolicyDefinition}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      name="name"
                      placeholder="The name of your policy..."
                    />
                  </div>
                </FormControlLayout>
              </div>
            </div>
            <AccordionItemActions>
              <Button
                type="button"
                size="sm"
                disabled={!name}
                onClick={() => {
                  setIsFirstStepComplete(true);
                  setStepIndex((x) => x + 1);
                }}>
                Next Step
              </Button>
            </AccordionItemActions>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem disabled={!isFirstStepComplete}>
          <AccordionItemHeader text="Set Your Policies" index={2} />
          <AccordionPanel>
            <div className="fineSection">
              <PolicyDetailsSection
                valueMap={valueMap}
                setValueMap={setValueMap}
              />
            </div>
            <AccordionItemActions>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setStepIndex((x) => x + 1);
                }}>
                Next Step
              </Button>
            </AccordionItemActions>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem disabled={!isFirstStepComplete}>
          <AccordionItemHeader text="Review" index={3} />
          <AccordionPanel>
            <Summary valueMap={valueMap} />
            <Form id={formIdCreatePolicyDefinition} method="post" replace>
              {policyDefinition?.uuid ? (
                <input
                  type="hidden"
                  name="policyDefinitionUuid"
                  value={policyDefinition.uuid}
                />
              ) : null}
            </Form>
            <AccordionItemActions>
              <Button
                type="submit"
                form={formIdCreatePolicyDefinition}
                state={
                  transition.state === "submitting" ? "pending" : undefined
                }>
                {policyDefinition ? "Update" : "Create"} Privacy Profile
              </Button>
            </AccordionItemActions>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function Summary(props: { valueMap: TValueMap }) {
  const { valueMap } = props;

  // if (
  //   blankTemplate?.data == null ||
  //   Object.keys(blankTemplate.data).length === 0
  // ) {
  //   return null;
  // }

  let list: {
    dataTypeEnum: string;
    dataElementList: {
      name: string;
      attributeList: { text: string; disabled: boolean }[];
    }[];
  }[] = [];

  for (let dataTypeEnum of Object.keys(blankTemplate)) {
    const x: any = blankTemplate[dataTypeEnum];
    const attributeTypeList = x.attributeTypeList;
    let attributeTypeMap = new Map();
    for (let at of attributeTypeList) {
      attributeTypeMap.set(at.enum, at);
    }
    list.push({
      dataTypeEnum,
      dataElementList: x.dataElementList.map((de: any) => {
        const dataElementEnum = de.enum;
        return {
          name: de.name,
          attributeList: de.attributeList.map((a: any) => {
            const text = attributeTypeMap.get(a.attributeTypeEnum)?.name;
            const key = getValueName({
              dataTypeEnum,
              dataElementEnum,
              attributeTypeEnum: a.attributeTypeEnum
            });
            const disabled = !valueMap.get(key);
            return { text, disabled };
          })
        };
      })
    });
  }

  return (
    <section className="summary">
      <h4>Your Privacy Coverage</h4>
      <p>
        Here's a summary of what data your service collects and shares based on
        the settings you've selected.
      </p>
      <ul className="summaryDataTypeList">
        {list.map((x, i) => (
          <li key={i}>
            <h4>{sentenceCase(x.dataTypeEnum)}</h4>
            <ul className="summaryDataElementList">
              {x.dataElementList.map((de, ii) => (
                <li key={ii}>
                  <h5>{de.name}</h5>
                  <ul className="summaryAttributeList">
                    {de.attributeList.map((a, iii) => (
                      <li key={iii} data-disabled={a.disabled}>
                        {a.text}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PolicyDetailsSection(props: {
  valueMap: TValueMap;
  setValueMap: React.Dispatch<React.SetStateAction<TValueMap>>;
}) {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  // if (
  //   blankTemplate?.data == null ||
  //   Object.keys(blankTemplate.data).length === 0
  // ) {
  //   return null;
  // }

  return (
    <section className="policyDetailsSection">
      <h3 className="subPreferencesHeading">Category Policies</h3>
      <Tabs
        orientation={TabsOrientation.Vertical}
        index={tabIndex}
        onChange={handleTabsChange}>
        <TabList>
          {Object.keys(blankTemplate).map((k, i) => {
            const color = colorHash.hex(k);
            return (
              <Tab
                key={i}
                style={
                  {
                    "--color-primary-l": color,
                    "--color-primary": color
                  } as React.CSSProperties
                }>
                {capitalCase(k)}
              </Tab>
            );
          })}
        </TabList>
        <TabPanels>
          {Object.values(blankTemplate).map((v: any, i) => {
            const dataElementList = v?.dataElementList ?? [];
            const attributeTypeList = v?.attributeTypeList ?? [];
            const name = Object.keys(blankTemplate)[i];
            const color = colorHash.hex(name);
            return (
              <PolicyDetailsSectionTabPanel
                key={i}
                color={color}
                name={name}
                tabIndex={tabIndex}
                valueMap={props.valueMap}
                setValueMap={props.setValueMap}
                dataElementList={dataElementList}
                attributeTypeList={attributeTypeList}
              />
            );
          })}
        </TabPanels>
      </Tabs>
    </section>
  );
}

function PolicyDetailsSectionTabPanel(props: {
  name: string;
  color: string;
  tabIndex: number;
  valueMap: TValueMap;
  setValueMap: React.Dispatch<React.SetStateAction<TValueMap>>;
  dataElementList: any[];
  attributeTypeList: any[];
}) {
  const isWide = useMedia("(min-width: 1024px)", true);

  const {
    name,
    color,
    tabIndex,
    valueMap,
    setValueMap,
    dataElementList,
    attributeTypeList
  } = props;

  return (
    <TabPanel>
      <div
        className="policyDetailsSectionTabPanelTop"
        style={
          {
            "--color-primary-l": color,
            "--color-primary": color
          } as React.CSSProperties
        }>
        <h4 className="policyDetailsSectionTabPanelHeading">
          {capitalCase(name)}
        </h4>
      </div>
      <div>
        <h4 className="dataElementsHeading">Privacy Elements</h4>
        <ul className="dataElementList">
          {dataElementList.map((de: any) => {
            const attributeList = de.attributeList;
            return (
              <li key={de.enum} className="dataElementListItem">
                <h4>{de.name}</h4>
                <ul className="attributeTypeList">
                  {attributeTypeList.map((at: any) => {
                    const attribute = attributeList.find(
                      (a: any) => a.attributeTypeEnum === at.enum
                    );
                    if (attribute == null) {
                      return null;
                    }
                    return (
                      <li key={at.enum} className="attributeTypeListItem">
                        <AttributeType
                          dataTypeEnum={de.dataTypeEnum}
                          dataElementEnum={de.enum}
                          attributeType={at}
                          attribute={attribute}
                          valueMap={valueMap}
                          setValueMap={setValueMap}
                          color={color}
                        />
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </TabPanel>
  );
}

function AttributeType(props: {
  dataTypeEnum: string;
  dataElementEnum: string;
  attributeType: {
    attributeTypeValueList: { enum: any }[];
    defaultValue: any;
    enum: any;
    jsonSchema: any;
    name: string;
  };
  attribute: {
    attributeTypeEnum: any;
    attributeTypeValueEnum: any;
    value: any;
  };
  valueMap: TValueMap;
  setValueMap: React.Dispatch<React.SetStateAction<TValueMap>>;
  color: string;
}) {
  const {
    dataTypeEnum,
    dataElementEnum,
    attributeType,
    attribute,
    valueMap,
    setValueMap,
    color
  } = props;
  const form = formIdCreatePolicyDefinition;
  const label = attributeType.name;
  const name = getValueName({
    dataTypeEnum,
    dataElementEnum,
    attributeTypeEnum: attributeType.enum
  });
  const value = attribute?.attributeTypeValueEnum ?? attribute?.value ?? "";
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const checked = event.target.value;
    setValueMap((curr) => {
      const next = cloneDeep(curr);
      next.set(name, checked);
      return next;
    });
  }
  if (attributeType?.jsonSchema?.type === "boolean") {
    const checked = valueMap.get(name) ?? false;
    return (
      <Checkbox
        label={label}
        name={name}
        checked={checked}
        onChange={(event) => {
          const checked = event.target.checked;
          setValueMap((curr) => {
            const next = cloneDeep(curr);
            next.set(name, checked);
            return next;
          });
        }}
        form={form}
        style={{ accentColor: color }}
      />
    );
  }
  if (attributeType?.jsonSchema?.type === "integer") {
    return (
      <Input
        label={label}
        name={name}
        type="number"
        step={1}
        value={value}
        onChange={onChange}
        form={form}
      />
    );
  }
  if (attributeType?.jsonSchema?.type === "number") {
    return (
      <Input
        label={label}
        name={name}
        type="number"
        value={value}
        onChange={onChange}
        form={form}
      />
    );
  }
  return (
    <Input
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      form={form}
    />
  );
}

// TODO: display checkmark instead of index if completed
function AccordionItemHeader(props: { index: number; text: string }) {
  const { index, text } = props;
  return (
    <h3>
      <AccordionButton as={Pressable} type="button">
        <span>{index}</span>
        <span>{text}</span>
      </AccordionButton>
    </h3>
  );
}

function AccordionItemActions(props: { children: React.ReactNode }) {
  const { children } = props;
  return <div className="accordionItemActions">{children}</div>;
}

export function FormControlLayout(props: {
  text: React.ReactElement;
  description: React.ReactElement;
  children: React.ReactNode;
}) {
  const { text, description, children } = props;
  return (
    <div className="privacyProfileCreateFormControlLayout">
      <div>
        {text}
        {description}
      </div>
      {children}
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

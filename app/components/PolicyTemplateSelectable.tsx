import { type LinksFunction } from "@remix-run/node";
import stylesButton from "@cl-privacy/components/button/styles.css";
import stylesAlert from "@cl-privacy/components/alert/styles.css";
import { IconCheckCircle } from "~/icons/IconCheckCircle";
import stylesInput from "@cl-privacy/components/input/styles.css";
import { type ResBody200GetPolicyTemplateList } from "~/sdk/Sdk";
import styles from "./PolicyTemplateSelectable.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: stylesButton },
    { rel: "stylesheet", href: stylesAlert },
    { rel: "stylesheet", href: stylesInput },
  ];
};

export function PolicyTemplateSelectable(props: {
  data: ResBody200GetPolicyTemplateList["results"][number];
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  form: string;
  index: number;
  name?: string;
}) {
  const {
    data,
    checked,
    onChange,
    form,
    index,
    name = "policyTemplateUuid",
  } = props;

  return (
    <label className="policyTemplateSelectable">
      <input
        type="radio"
        name={name}
        value={data.uuid}
        checked={checked}
        onChange={onChange}
        form={form}
      />
      <div>
        <div>
          <div
            className={
              index >= 2
                ? "policyTemplateSelectableTextContainerJustifyContentEnd"
                : "policyTemplateSelectableTextContainer"
            }
          >
            <h4>{data.name}</h4>
          </div>
          <IconCheckCircle />
        </div>
        {/* {data.shortDescription ? <p className="policyTemplateSelectableDescription">{data.shortDescription}</p> : null} */}
      </div>
    </label>
  );
}

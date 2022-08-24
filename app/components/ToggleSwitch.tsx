import React from "react";
import styles from "./ToggleSwitch.css";

export function ToggleSwitch(props: {
  isOn: boolean;
  handleToggle: React.ChangeEventHandler<HTMLInputElement>;
  formId: string;
  name: string;
}) {
  const { isOn, handleToggle, formId, name } = props;

  return (
    <>
      <input
        name={name}
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
        form={formId}
      />
      <label
        style={{ background: isOn ? "#03C03C" : undefined }}
        className="react-switch-label"
        htmlFor={`react-switch-new`}>
        <span className={`react-switch-button`} />
      </label>
    </>
  );
}

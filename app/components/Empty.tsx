import * as React from "react";
import { type LinksFunction } from "@remix-run/node";
import { IconBuild } from "~/icons/IconBuild";
import styles from "./Empty.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export function Empty(props: {
  heading: string;
  text: string;
  action?: React.ReactNode;
}) {
  const { heading, text, action } = props;
  return (
    <div className="empty-7d3e5307">
      <IconBuild />
      <h3>{heading}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

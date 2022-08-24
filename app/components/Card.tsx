import * as React from "react";
import { type LinksFunction } from "@remix-run/node";
import styles from "./Card.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export function Card(props: { children: React.ReactNode }) {
  const { children } = props;
  return <div className="card-bf55b3c6f239">{children}</div>;
}

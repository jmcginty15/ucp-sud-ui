import * as React from "react";
import { type LinksFunction } from "@remix-run/node";
import { NavLink } from "@remix-run/react";
import styles from "./Nav.css";
import { Tooltip } from "@cl-privacy/components/tooltip";
import stylesTooltip from "@cl-privacy/components/tooltip/styles.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: stylesTooltip },
  ];
};

export function Nav(props: {
  items: {
    to: string;
    text: string;
    icon: React.ElementType;
    external?: boolean;
    disabled?: boolean;
    disabledMessage?: string;
  }[];
}) {
  const { items } = props;
  return (
    <nav className="nav">
      <ul>
        {items.map((x, i) => {
          return (
            <li key={x.to}>
              {x.disabled ? (
                <Tooltip label={x.disabledMessage}>
                  <div>
                    <div>
                      <x.icon />
                      {x.text}
                    </div>
                  </div>
                </Tooltip>
              ) : x.external ? (
                <a href={x.to} target="_blank" rel="noopener noreferrer">
                  <x.icon />
                  {x.text}
                </a>
              ) : (
                <NavLink
                  end={i === 0}
                  to={x.to}
                  className={({ isActive }) =>
                    isActive ? "navLinkActive" : undefined
                  }
                >
                  <x.icon />
                  {x.text}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function NavContainer(props: { children: React.ReactNode }) {
  const { children } = props;
  return <div className="navContainer">{children}</div>;
}

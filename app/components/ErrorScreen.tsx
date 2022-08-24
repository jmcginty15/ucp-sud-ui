import { type LinksFunction } from "@remix-run/node";
import styles from "./ErrorScreen.css";
import { Card, links as linksCard } from "./Card";
import { IconError } from "~/icons/IconError";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }, ...linksCard()];
};

export function ErrorScreen(props: { message: string }) {
  const { message } = props;
  return (
    <div className="error-23bd417b">
      <div>
        <Card>
          <IconError />
          <h1>App Error</h1>
          <p>{message}</p>
        </Card>
      </div>
    </div>
  );
}

import { type LinksFunction } from "@remix-run/node";
import { Link as RLink } from "@remix-run/react";
import { Button } from "@cl-privacy/components/button";
import stylesButton from "@cl-privacy/components/button/styles.css";
import styles from "./404.css";
import { Card, links as linksCard } from "./Card";
import { IconBrokenImage } from "~/icons/IconBrokenImage";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: stylesButton },
    ...linksCard(),
  ];
};

export function NotFound() {
  return (
    <div className="_404-4d7eeb17">
      <div>
        <Card>
          <IconBrokenImage />
          <h1>Not Found</h1>
          <p>Sorry, we couldn't find that.</p>
          <Button as={RLink} to="/">
            Back to Home
          </Button>
        </Card>
      </div>
    </div>
  );
}

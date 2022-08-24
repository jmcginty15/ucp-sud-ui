import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Button } from "@cl-privacy/components/button";
import stylesButton from "@cl-privacy/components/button/styles.css";
import { type LinksFunction } from "@remix-run/node";
import { Link as RLink } from "@remix-run/react";
import styles from "./Pagination.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: stylesButton },
  ];
};

type TTo = React.ComponentProps<typeof RLink>["to"] | null;

export function Pagination(input: { nextLink: TTo; prevLink: TTo }) {
  const { nextLink, prevLink } = input;
  const shouldNotRender = nextLink == null && prevLink == null;
  if (shouldNotRender) {
    return null;
  }
  return (
    <div data-pagination="">
      {prevLink == null ? (
        <Button
          state="disabled"
          variant="neutral"
          size="xs"
          icon={{ icon: <MdKeyboardArrowLeft />, position: "start" }}
        >
          Prev
        </Button>
      ) : (
        <Button
          as={RLink}
          to={prevLink}
          variant="neutral"
          size="xs"
          icon={{ icon: <MdKeyboardArrowLeft />, position: "start" }}
        >
          Prev
        </Button>
      )}
      {nextLink == null ? (
        <Button
          state="disabled"
          variant="neutral"
          size="xs"
          icon={{ icon: <MdKeyboardArrowRight />, position: "end" }}
        >
          Next
        </Button>
      ) : (
        <Button
          as={RLink}
          to={nextLink}
          variant="neutral"
          size="xs"
          icon={{ icon: <MdKeyboardArrowRight />, position: "end" }}
        >
          Next
        </Button>
      )}
    </div>
  );
}

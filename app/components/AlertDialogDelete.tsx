import * as React from "react";
import { type LinksFunction } from "@remix-run/node";
import {
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogLabel,
  AlertDialogActions,
} from "@cl-privacy/components/alert-dialog";
import stylesAlertDialog from "@cl-privacy/components/alert-dialog/styles.css";
import { Button } from "@cl-privacy/components/button";
import stylesButton from "@cl-privacy/components/button/styles.css";
import styles from "./AlertDialogDelete.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesAlertDialog },
    { rel: "stylesheet", href: stylesButton },
    { rel: "stylesheet", href: styles },
  ];
};

export function AlertDialogDelete(props: {
  heading: string;
  children: React.ReactNode;
  buttonProps: React.ComponentProps<typeof Button>;
  toggleDialog: () => void;
}) {
  const { toggleDialog, buttonProps, heading, children } = props;
  const leastDestructiveRef = React.useRef<HTMLButtonElement>(null);
  return (
    <AlertDialogOverlay
      onDismiss={toggleDialog}
      leastDestructiveRef={leastDestructiveRef}
    >
      <AlertDialogContent>
        <AlertDialogLabel>{heading}</AlertDialogLabel>
        <AlertDialogDescription>{children}</AlertDialogDescription>
        <AlertDialogActions>
          <Button
            ref={leastDestructiveRef}
            type="button"
            onClick={toggleDialog}
            variant="transparent"
          >
            Cancel
          </Button>
          <Button type="button" variant="danger" {...buttonProps} />
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialogOverlay>
  );
}

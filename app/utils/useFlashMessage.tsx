import { FlashMessage } from "@cl-privacy/components/flash-message";
import * as React from "react";
import { type TFlashMessage } from "./session.server";

export function useFlashMessage() {
  return React.useContext(FlashMessageContext);
}

export function FlashMessageProvider(
  props: { flashMessage: TFlashMessage } & { children: React.ReactNode }
) {
  const { children } = props;
  const [flashMessage, setFlashMessage] = React.useState(props.flashMessage);
  React.useEffect(() => {
    setFlashMessage(props.flashMessage);
  }, [props.flashMessage]);
  return (
    <FlashMessageContext.Provider value={{ flashMessage, setFlashMessage }}>
      {flashMessage == null ? null : (
        <FlashMessage
          variant={flashMessage.type}
          onClose={() => setFlashMessage(null)}
        >
          {flashMessage.message}
        </FlashMessage>
      )}
      {children}
    </FlashMessageContext.Provider>
  );
}

type TFlashMessageContext = {
  flashMessage: TFlashMessage | null;
  setFlashMessage: React.Dispatch<React.SetStateAction<TFlashMessage | null>>;
};

const FlashMessageContext = React.createContext<TFlashMessageContext>(
  // @ts-expect-error
  {}
);

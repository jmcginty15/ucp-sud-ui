import * as React from "react";

export function Heading(
  props: React.ComponentProps<"h1"> & {
    as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  }
) {
  const { as: Comp, ...rest } = props;
  return <Comp data-ph-heading="" {...rest} />;
}

'use client';

import { forwardRef } from "react";
import { Button } from "./button";
import { type ButtonProps } from "./button";

export const ClientButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <Button ref={ref} {...props} />;
  }
);

ClientButton.displayName = "ClientButton";

import type { ComponentProps } from "react";
import { Link } from "@tanstack/react-router";

// Type-loose Link wrapper for prototype navigation with dynamic paths.
type AnyLinkProps = Omit<ComponentProps<typeof Link>, "to" | "params" | "search"> & {
  to: string;
  params?: Record<string, unknown>;
  search?: Record<string, unknown>;
};

export function AppLink(props: AnyLinkProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const L = Link as any;
  return <L {...props} />;
}

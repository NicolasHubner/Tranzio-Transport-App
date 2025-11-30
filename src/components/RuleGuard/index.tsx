import { Fragment } from "react";
import { useHasPermission } from "~/hooks/useHasPermission";

interface RuleGuardProps {
  rule: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RuleGuard: React.FC<RuleGuardProps> = ({
  rule,
  children,
  fallback = null,
}) => {
  return (
    <Fragment>
      {useHasPermission({ ruleName: rule }) ? children : fallback}
    </Fragment>
  );
};

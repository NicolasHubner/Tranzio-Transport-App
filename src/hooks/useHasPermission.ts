import { useQuery } from "@apollo/client";
import {
  ConfigRuleItemsResponse,
  configRuleItemsQuery,
} from "~/graphql/queries/configRuleItems";
import { User } from "~/types/User";
import { useAuth } from "./useAuth";

function useHasRulePermission(
  user: User | undefined,
  ruleName: string,
): boolean {
  const { data } = useQuery<ConfigRuleItemsResponse>(configRuleItemsQuery);

  const roleSatisfiesCondition =
    data?.configItemRoles.data.some(componentMap => {
      if (ruleName !== componentMap.attributes.rule) {
        return false;
      }

      return componentMap.attributes.config_roles.data.some(roleName => {
        if (user === null) {
          return false;
        }

        if (
          roleName.attributes.role !== user?.role?.name &&
          componentMap.attributes.condition === "Show"
        ) {
          return false;
        }

        if (componentMap.attributes.condition === "Show") {
          return roleName.attributes.role === user?.role?.name;
        } else if (componentMap.attributes.condition === "Hide") {
          return roleName.attributes.role !== user?.role?.name;
        } else {
          return false;
        }
      });
    }) || false;

  return roleSatisfiesCondition;
}

export function useHasPermission({ ruleName }: { ruleName: string }) {
  const { user } = useAuth();

  return useHasRulePermission(user, ruleName);
}

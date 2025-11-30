import { gql } from "@apollo/client";

export interface ConfigRuleItemsResponse {
  configItemRoles: {
    data: Array<{
      id: string;
      attributes: {
        rule: string;
        condition: "Show" | "Hide";
        config_roles: {
          data: Array<{
            id: string;
            attributes: {
              role: string;
            };
          }>;
        };
      };
    }>;
  };
}

export const configRuleItemsQuery = gql`
  query ConfigRules {
    configItemRoles {
      data {
        attributes {
          rule
          condition
          config_roles {
            data {
              attributes {
                role
              }
            }
          }
        }
      }
    }
  }
`;

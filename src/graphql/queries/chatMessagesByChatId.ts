import { gql } from "@apollo/client";

export type ChatMessageState = "pending" | "seen";

export interface ChatMessagesByChatIdQueryResponse {
  chatMessages: {
    data: Array<{
      id: string;
      attributes: {
        message: string;
        createdAt: string;
        hasPriority: boolean;
        chatMessageStates: {
          data: Array<{
            id: string;
            attributes: {
              state: ChatMessageState;
              receiver: {
                data: {
                  id: string;
                };
              };
            };
          }>;
        };
        owner: {
          data: {
            id: string;
            attributes: {
              name: string;
            };
          };
        };
      };
    }>;
  };
}

export interface ChatMessagesByChatIdQueryVariables {
  id: string;
}

export const chatMessagesByChatIdQuery = gql`
  query CchatMessagesByChatId($id: ID!) {
    chatMessages(
      sort: "createdAt:desc"
      pagination: { limit: -1 }
      filters: { chat: { id: { eq: $id } }, owner: { id: { not: null } } }
    ) {
      data {
        id
        attributes {
          message
          createdAt
          hasPriority
          chatMessageStates(pagination: { limit: -1 }) {
            data {
              id
              attributes {
                state
                receiver {
                  data {
                    id
                  }
                }
              }
            }
          }
          owner {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

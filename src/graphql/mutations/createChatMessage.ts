import { gql } from "@apollo/client";

export type ChatMessageType = "group" | "directly";

export interface CreateChatMessageResponse {
  createChatMessage: {
    data: {
      id: string;
      attributes: {
        message: string;
        createdAt: string;
        hasPriority: boolean;
        owner: {
          data: {
            id: string;
            attributes: {
              name: string;
            };
          };
        };
      };
    };
  };
}

export interface CreateChatMessageVariables {
  input: {
    message: string;
    chat: string;
    owner: string;
    publishedAt: string;
    hasPriority?: boolean;
  };
}

export const createChatMessageMutation = gql`
  mutation CreateChatMessage($input: ChatMessageInput!) {
    createChatMessage(data: $input) {
      data {
        id
        attributes {
          message
          hasPriority
          createdAt
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

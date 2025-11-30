import { gql } from "@apollo/client";

export interface CreateChatResponse {
  createChat: {
    data: {
      id: string;
      attributes: {
        users: {
          data: Array<{
            id: string;
          }>;
        };
      };
    };
  };
}

export interface CreateChatVariables {
  data: {
    users: string[];
    type: "direct" | "group";
    name?: string;
    publishedAt: string;
  };
}

export const createChatMutation = gql`
  mutation createChat($data: ChatInput!) {
    createChat(data: $data) {
      data {
        id
        attributes {
          users {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

import { gql } from "@apollo/client";
import type { ChatMessageState } from "../queries/chatMessagesByChatId";

export type ChatMessageStateType = "pending" | "delivered" | "seen";

export interface CreateChatMessageStateResponse {
  createChatMessageState: {
    data: {
      id: string;
      attributes: {
        state: ChatMessageState;
        receiver: {
          data: {
            id: string;
          };
        };
      };
    };
  };
}

export interface CreateChatMessageStateVariables {
  input: {
    receiver: string;
    state: ChatMessageStateType;
    chatMessage: string;
    publishedAt: string;
  };
}

export const createChatMessageStateMutation = gql`
  mutation CreateChatMessageState($input: ChatMessageStateInput!) {
    createChatMessageState(data: $input) {
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
  }
`;

import { gql } from "@apollo/client";
import { ChatMessageStateType } from "../mutations/createChatMessageState";

export interface ChatMessagesStateQueryResponse {
  chatMessageStates: {
    data: {
      id: string;
      attributes: {
        state: ChatMessageStateType;
        receiver: {
          data: {
            id: string;
            attributes: {
              name: string;
            };
          };
        };
        chatMessage: {
          id: string;
        };
      };
    };
  };
}

export const chatMessageStateQuery = gql`
  query GetAllChatMessageState {
    chatMessageStates {
      data {
        id
        attributes {
          state
          receiver {
            data {
              id
              attributes {
                name
              }
            }
          }
          chatMessage {
            id
          }
        }
      }
    }
  }
`;

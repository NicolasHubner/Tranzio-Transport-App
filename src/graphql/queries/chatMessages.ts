import { gql } from "@apollo/client";
import { ChatMessageType } from "../mutations/createChatMessage";

export interface ChatMessagesQueryResponse {
  chatMessages: {
    data: Array<{
      id: string;
      attributes: {
        message: string;
        type: ChatMessageType;
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

export const chatMessageQuery = gql`
  query GetAllChatMessages {
    chatMessages {
      data {
        id
        attributes {
          message
          type
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

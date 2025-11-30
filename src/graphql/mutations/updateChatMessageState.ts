import { gql } from "@apollo/client";

export interface UpdateChatMessageStateResponse {
  updateChatMessageState: {
    data: {
      id: string;
      attributes: {
        state: string;
      };
    };
  };
}

export interface UpdateChatMessageStateVariables {
  id: string;
  input: {
    state: string;
  };
}

export const updateChatMessageStateMutation = gql`
  mutation updateChatMessageState($id: ID!, $input: ChatMessageStateInput!) {
    updateChatMessageState(id: $id, data: $input) {
      data {
        id
        attributes {
          state
        }
      }
    }
  }
`;

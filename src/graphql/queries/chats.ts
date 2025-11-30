import { gql } from "@apollo/client";

export type ChatType = "group" | "direct";
export type ChatMessageState = "pending" | "seen";

export interface ChatsQueryResponse {
  chats: {
    data: Array<{
      id: string;
      attributes: {
        type: ChatType;
        name: string;
        users: {
          data: Array<{
            id: string;
            attributes: {
              name: string;
            };
          }>;
        };
        chatMessages: {
          data: Array<{
            id: string;
            attributes: {
              hasPriority: boolean;
              createdAt: string;
              message: string;
              owner: {
                data: {
                  id: string;
                  attributes: {
                    name: string;
                  };
                };
              };
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
            };
          }>;
        };
      };
    }>;
  };
}

export interface ChatsQueryVariables {
  type?: ChatType;
  userId?: string;
  query?: string;
}

export const chatsQuery = gql`
  query GetAllChats($type: String, $userId: ID, $query: String) {
    chats(
      pagination: { limit: -1 }
      filters: {
        type: { eq: $type }
        users: { id: { eq: $userId } }
        or: [
          { name: { containsi: $query } }
          { users: { name: { containsi: $query } } }
        ]
      }
    ) {
      data {
        id
        attributes {
          type
          name
          users {
            data {
              id
              attributes {
                name
              }
            }
          }
          chatMessages(sort: "createdAt:desc", pagination: { limit: -1 }) {
            data {
              id
              attributes {
                createdAt
                hasPriority
                message
                owner {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
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
              }
            }
          }
        }
      }
    }
  }
`;

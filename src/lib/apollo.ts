import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAccessToken } from "~/utils/accessToken";
import { API_BASE_URL } from "~/utils/constants";

const authLink = setContext((_, context) => {
  const token = getAccessToken();

  return {
    ...context,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...context.headers,
    },
  };
});

const httpLink = createHttpLink({
  uri: `${API_BASE_URL}/graphql`,
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Issue: {
        merge: true,
      },
      Flight: {
        merge: true,
      },
      AttendanceLive: {
        merge: true,
      },
      AttendanceLiveTask: {
        merge: true,
      },
      UsersPermissionsUser: {
        merge: true,
      },
      ChatMessage: {
        merge: true,
      },
      Chat: {
        merge: true,
      },
      ChatMessageState: {
        merge: true,
      },
      Department: {
        merge: true,
      },
      MaterialRequest: {
        merge: true,
      },
      MaterialRequestItem: {
        merge: true,
      },
    },
  }),
});

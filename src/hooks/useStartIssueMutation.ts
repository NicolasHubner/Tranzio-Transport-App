import { useMutation } from "@apollo/client";
import {
  StartIssueMutationVariables,
  startIssueMutation,
} from "~/graphql/mutations/start-issue";

export function useStartIssueMutation() {
  return useMutation<{}, StartIssueMutationVariables>(startIssueMutation, {
    fetchPolicy: "no-cache",
  });
}

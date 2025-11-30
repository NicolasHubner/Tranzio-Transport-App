import { useMutation } from "@apollo/client";
import {
  EndIssueMutationVariables,
  endIssueMutation,
} from "~/graphql/mutations/end-issue";

export function useEndIssueMutation() {
  return useMutation<{}, EndIssueMutationVariables>(endIssueMutation, {
    fetchPolicy: "no-cache",
  });
}

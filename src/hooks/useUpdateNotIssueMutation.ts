import { useMutation } from "@apollo/client";
import { NotAttendedIssueMutationVariables, notAttendedIssueMutation } from "~/graphql/mutations/update_not_issue";

export function useUpdateNotIssueMutation() {
  return useMutation<{}, NotAttendedIssueMutationVariables>(notAttendedIssueMutation, {
    fetchPolicy: "no-cache",
  });
}

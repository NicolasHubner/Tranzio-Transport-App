import { useMutation } from "@apollo/client";
import {
  CreateCheckinMutationVariables,
  createCheckinMutation,
} from "~/graphql/mutations/create-checkin";

export function useCreateCheckInMutation() {
  return useMutation<{}, CreateCheckinMutationVariables>(
    createCheckinMutation,
    {
      fetchPolicy: "no-cache",
    },
  );
}

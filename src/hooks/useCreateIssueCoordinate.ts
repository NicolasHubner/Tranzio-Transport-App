import { useMutation } from "@apollo/client";
import { CreateIssueCoordinateMutation, CreateIssueCoordinateVariables } from "~/graphql/mutations/create-issueCoordinate";

export function useCreateIssueCoordinate() {
  return useMutation<{}, CreateIssueCoordinateVariables>(
    CreateIssueCoordinateMutation,
    {
      fetchPolicy: "no-cache",
    },
  );
}

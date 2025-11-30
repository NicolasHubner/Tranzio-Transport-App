import type { IssueData } from "../graphql/queries/issues";
import type { Issue } from "../types/Issue";

export function formatIssue({ id, attributes }: IssueData): Issue {
  return {
    id,
    shift: attributes.shift,
    dtEnd: attributes.dtEnd,
    status: attributes.status,
    dtStart: attributes.dtStart,
    createdAt: attributes.createdAt,
    requestedAt: attributes.requestedAt,
    passengerName: attributes.passengerName,
    origin: attributes.origin.data.attributes,
    destiny: attributes.destiny.data.attributes,
    flight: attributes.flight.data.attributes,
    workerCoordinatesWhenRequested:
      attributes.workerCoordinatesWhenRequested?.data.attributes,

    serviceTypes: attributes.issuePassengers.data.map(
      ({ attributes: { serviceType } }) => serviceType,
    ),
  };
}

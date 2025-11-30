import {
  CHAT_FLIGHT_MENTION_REGEX,
  CHAT_USER_MENTION_REGEX,
} from "./constants";

interface User {
  id: string | number;
  name: string;
}

interface Options {
  users?: User[];
  loggedUserId?: string;
}

export function formatChatMessage(
  value: string,
  { users, loggedUserId }: Options = {},
) {
  return value
    .replace(CHAT_USER_MENTION_REGEX, (_, userName: string, userId: string) => {
      return `@${
        userId === loggedUserId
          ? "Você"
          : users?.find(user => user.id.toString() === userId)?.name || userName
      }`;
    })
    .replace(
      CHAT_FLIGHT_MENTION_REGEX,
      (_, flightNumber: string) => `#${flightNumber}`,
    );
}

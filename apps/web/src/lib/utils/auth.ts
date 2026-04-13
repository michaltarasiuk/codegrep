import {
  anonymousClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

export const authPlugins = [
  anonymousClient(),
  inferAdditionalFields({
    user: {
      personalInstructions: {
        type: "string",
        required: false,
      },
    },
  }),
] as const;

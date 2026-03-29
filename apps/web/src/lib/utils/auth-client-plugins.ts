import {
  anonymousClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

export const authClientPlugins = [
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

import {
  anonymousClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

export let authPlugins = [
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

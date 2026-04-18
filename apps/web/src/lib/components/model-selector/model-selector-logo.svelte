<script lang="ts">
  import { cn } from "@workspace/ui/cn.js";
  import type { HTMLImgAttributes } from "svelte/elements";

  type Provider =
    | "moonshotai-cn"
    | "lucidquery"
    | "moonshotai"
    | "zai-coding-plan"
    | "alibaba"
    | "xai"
    | "vultr"
    | "nvidia"
    | "upstage"
    | "groq"
    | "github-copilot"
    | "mistral"
    | "vercel"
    | "nebius"
    | "deepseek"
    | "alibaba-cn"
    | "google-vertex-anthropic"
    | "venice"
    | "chutes"
    | "cortecs"
    | "github-models"
    | "togetherai"
    | "azure"
    | "baseten"
    | "huggingface"
    | "opencode"
    | "fastrouter"
    | "google"
    | "google-vertex"
    | "cloudflare-workers-ai"
    | "inception"
    | "wandb"
    | "openai"
    | "zhipuai-coding-plan"
    | "perplexity"
    | "openrouter"
    | "zenmux"
    | "v0"
    | "iflowcn"
    | "synthetic"
    | "deepinfra"
    | "zhipuai"
    | "submodel"
    | "zai"
    | "inference"
    | "requesty"
    | "morph"
    | "lmstudio"
    | "anthropic"
    | "aihubmix"
    | "fireworks-ai"
    | "modelscope"
    | "llama"
    | "scaleway"
    | "amazon-bedrock"
    | "cerebras"
    // pattern for autocomplete-friendly string union
    | (string & {});

  type ModelSelectorLogoProps = Omit<HTMLImgAttributes, "src" | "alt"> & {
    provider: Provider;
  };

  let {
    provider,
    class: className,
    ...restProps
  }: ModelSelectorLogoProps = $props();
</script>

<img
  src={`https://models.dev/logos/${provider}.svg`}
  alt={`${provider} logo`}
  height={12}
  width={12}
  class={cn("size-3 dark:invert", className)}
  {...restProps}
/>

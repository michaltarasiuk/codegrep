import Root from "./message.svelte";
import Action from "./message-action.svelte";
import Actions from "./message-actions.svelte";
import Branch from "./message-branch.svelte";
import BranchContent from "./message-branch-content.svelte";
import BranchNext from "./message-branch-next.svelte";
import BranchPage from "./message-branch-page.svelte";
import BranchPrevious from "./message-branch-previous.svelte";
import BranchSelector from "./message-branch-selector.svelte";
import Content from "./message-content.svelte";
import Parts from "./message-parts.svelte";
import Response from "./message-response.svelte";
import Toolbar from "./message-toolbar.svelte";

export {
  Root,
  Content,
  Response,
  Actions,
  Action,
  Branch,
  BranchContent,
  BranchSelector,
  BranchPrevious,
  BranchNext,
  BranchPage,
  Toolbar,
  Parts,
  //
  Root as Message,
  Content as MessageContent,
  Parts as MessageParts,
  Response as MessageResponse,
  Actions as MessageActions,
  Action as MessageAction,
  Branch as MessageBranch,
  BranchContent as MessageBranchContent,
  BranchSelector as MessageBranchSelector,
  BranchPrevious as MessageBranchPrevious,
  BranchNext as MessageBranchNext,
  BranchPage as MessageBranchPage,
  Toolbar as MessageToolbar,
};

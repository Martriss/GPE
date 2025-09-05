<script lang="ts">
  import X from "@lucide/svelte/icons/x";
  import type { Snippet } from "svelte";

  interface ModalProps {
    dialogRef: HTMLDialogElement;
    onClose: (e: Event) => void;
    children: Snippet<[]>;
  }

  let { dialogRef = $bindable(), onClose, children }: ModalProps = $props();
</script>

<dialog
  bind:this={dialogRef}
  data-testid="modal"
  class="absolute-center bg-(--body-background-color) dark:bg-(--body-background-color-dark) text-(--base-font-color) dark:text-(--base-font-color-dark) py-4 px-8 rounded-xl min-w-[75vw] w-screen unset-width overflow-clip"
>
  <button
    type="button"
    data-testid="button-close-popup"
    onclick={onClose}
    class="relative top-2 start-[97%] opacity-65"
    aria-label="fermer la popup"
  >
    <X size={32} />
  </button>

  {@render children()}
</dialog>

<style>
  ::backdrop {
    backdrop-filter: blur(4px);
  }

  @media (width >= 64rem) {
    .unset-width {
      width: unset;
    }
  }
</style>

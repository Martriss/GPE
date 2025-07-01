<script lang="ts">
  import type DeckType from "$lib/interfaces/DeckType";
  import SquarePen from "@lucide/svelte/icons/square-pen";
  import X from "@lucide/svelte/icons/x";
  import Copy from "@lucide/svelte/icons/copy";
  import Share2 from "@lucide/svelte/icons/share-2";
  import Eye from "@lucide/svelte/icons/eye";
  import { goto } from "$app/navigation";
  import CopyClipboardModal from "../Modal/CopyClipboardModal.svelte";
  import { page } from "$app/state";

  interface DeckProps {
    deck: DeckType;
    onDelete?: (e: Event) => void;
  }

  let { deck, onDelete }: DeckProps = $props();

  // svelte-ignore non_reactive_update
  let dialogModalShare: HTMLDialogElement;

  const host: string = page.url.host;

  const isShareable: boolean = deck.isPublic || deck.isShared ? true : false;

  const handleOpenDialog = () => {
    dialogModalShare.showModal();
  };
  const handleCloseDialog = () => {
    dialogModalShare.close();
  };

  const handleUpdate = () => {
    goto(`/decks/${deck.id}`);
  };

  const handleShare = () => {
    handleOpenDialog();
  };
</script>

<div class="flex border rounded-lg py-2 px-2 justify-between">
  <div class="flex gap-2 md:ms-8">
    <span>{deck.name}</span>
    <span class="italic hidden md:block opacity-80">{deck.description}</span>
    <!-- Mettre une taille minimum pour la description à mon avis -->
  </div>
  <div class="flex gap-2">
    <span
      class="vr border-l-2 border-(--base-font-color) dark:border-(--base-font-color-dark)"
    ></span>
    <button
      type="button"
      aria-label={onDelete ? "modifier" : "voir"}
      onclick={handleUpdate}
    >
      <!-- Suivant si l'on se place dans un contexte de modification ou de visualisation (private/public) -->
      {#if onDelete}
        <SquarePen />
      {:else}
        <Eye />
      {/if}
    </button>
    {#if onDelete}
      <button
        type="button"
        aria-label="supprimer definitivement"
        data-deck={JSON.stringify(deck)}
        onclick={onDelete}
      >
        <X />
      </button>
    {/if}
    <button type="button" aria-label="duppliquer" disabled>
      <Copy />
    </button>
    <button
      type="button"
      aria-label="partager"
      onclick={handleShare}
      disabled={!isShareable}
    >
      <Share2 />
    </button>
  </div>
  <CopyClipboardModal
    bind:dialogRef={dialogModalShare}
    onClose={handleCloseDialog}
    title="Partager le deck"
    valueToCopy={`${host}/decks/${deck.id}`}
  />
</div>

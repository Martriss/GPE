<script lang="ts">
  import Modal from "./Modal.svelte";

  interface ConfirmModalProps {
    dialogRef: HTMLDialogElement;
    title: string;
    question: string;
    onCloseTrue: (e: Event) => void;
    onCloseFalse: (e: Event) => void;
    buttoname1?: string;
    buttoname2?: string;
  }

  let {
    dialogRef = $bindable(),
    title,
    question,
    onCloseTrue,
    onCloseFalse,
    buttoname1 = "Je confirme",
    buttoname2 = "Annuler",
  }: ConfirmModalProps = $props();
</script>

<Modal bind:dialogRef onClose={onCloseFalse}>
  <div class="flex flex-col items-center gap-8">
    <header>
      <h2 class="h2 text-wrap text-center">{title}</h2>
    </header>
    <article class="text-lg text-pretty">
      {question}
    </article>
    <footer class="flex gap-y-4 flex-wrap gap-x-16 justify-center">
      <button
        type="button"
        onclick={onCloseTrue}
        class="btn preset-tonal hover:preset-filled-primary-500"
      >
        {buttoname1}
      </button>
      <button
        type="button"
        onclick={onCloseFalse}
        class="btn preset-tonal hover:preset-filled-error-800-200"
      >
        {buttoname2}
      </button>
    </footer>
  </div>
</Modal>

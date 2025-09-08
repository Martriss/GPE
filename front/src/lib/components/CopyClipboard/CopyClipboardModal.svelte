<script lang="ts">
  import Modal from "../Modal/Modal.svelte";
  import CopyClipboard from "./CopyClipboard.svelte";

  interface CopyClipboardModalProps {
    dialogRef: HTMLDialogElement;
    onClose: (e: Event) => void;
    title: string;
    valueToCopy: string;
  }

  let {
    dialogRef = $bindable(),
    title,
    onClose,
    valueToCopy,
  }: CopyClipboardModalProps = $props();
</script>

<Modal bind:dialogRef {onClose}>
  <div class="flex flex-col items-center gap-8">
    <header>
      <h2 class="h2 text-wrap text-center">{title}</h2>
    </header>
    <div class="w-full lg:w-[90%] xl:w-[80%]">
      <CopyClipboard {valueToCopy} />
    </div>
  </div>
</Modal>

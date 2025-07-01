<script lang="ts">
  import TooltipButton from "../Tooltip/TooltipButton.svelte";
  import Modal from "./Modal.svelte";

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

  const handleCopy = (e: Event) => {
    navigator.clipboard.writeText(valueToCopy);
  };
</script>

<Modal bind:dialogRef {onClose}>
  <div class="flex flex-col items-center gap-8">
    <header>
      <h2 class="h2 text-wrap text-center">{title}</h2>
    </header>
    <div class="flex gap-x-4 w-full lg:w-[90%] xl:w-[80%]">
      <input
        class="input"
        type="text"
        value={valueToCopy}
        readonly
        aria-label="élément prêt à être copier"
      />
      <TooltipButton
        infoOnClick="Copié !"
        infoOnHover="Copier dans le presse-papiers"
        nameButton="Copier"
        handleClickButton={handleCopy}
      ></TooltipButton>
    </div>
  </div>
</Modal>

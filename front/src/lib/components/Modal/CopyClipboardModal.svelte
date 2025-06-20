<script lang="ts">
  import ButtonFilled from "../Button/ButtonFilled.svelte";
  import Modal from "./Modal.svelte";
  import { Tooltip } from "@skeletonlabs/skeleton-svelte";

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

  let openState = $state(false);

  const handleCopy = () => {
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
      <!-- <ButtonFilled name="Copier" handleClick={handleCopy} /> -->
      <Tooltip
        open={openState}
        onOpenChange={(e) => (openState = e.open)}
        positioning={{ placement: "top" }}
        triggerBase="underline"
        contentBase="card preset-filled p-4"
        openDelay={200}
        arrow
      >
        {#snippet trigger()}<ButtonFilled
            name="Copier"
            handleClick={handleCopy}
          />{/snippet}
        {#snippet content()}Copier dans le presse papier{/snippet}
      </Tooltip>
    </div>
  </div>
</Modal>

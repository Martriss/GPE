<script lang="ts">
  import TooltipButton from "../Tooltip/TooltipButton.svelte";

  interface CopyClipboardProps {
    valueToCopy: string;
  }

  let { valueToCopy }: CopyClipboardProps = $props();

  const handleCopy = () => {
    navigator.clipboard.writeText(valueToCopy);
  };
</script>

<div class="flex gap-x-4">
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

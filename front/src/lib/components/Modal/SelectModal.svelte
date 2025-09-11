<script lang="ts">
  import Modal from "./Modal.svelte";
  import ButtonFilled from "../Button/ButtonFilled.svelte";
  import type { OptionType } from "$lib/interfaces/InputType";

  interface SelectModalProps {
    dialogRef: HTMLDialogElement;
    onClose: (e: Event) => void;
    value: string;
    options: OptionType[];
    title: string;
    buttonName: string;
    onClickButton: (e: Event) => void;
    substitueInfo?: string;
  }

  let {
    dialogRef = $bindable(),
    onClose,
    value = $bindable(),
    options,
    title,
    buttonName,
    substitueInfo = "Aucune option n'est disponible",
    onClickButton,
  }: SelectModalProps = $props();

  let hasAtLeastOneOption = $derived(options.length > 0);
</script>

<Modal bind:dialogRef {onClose}>
  <div class="flex flex-col items-center gap-8">
    <header>
      <h2 class="h2 text-wrap text-center" id="select-label">
        {title}
      </h2>
    </header>
    <div>
      {#if hasAtLeastOneOption}
        <select
          aria-labelledby="select-label"
          class="select"
          bind:value
          required
        >
          {#each options as { label, value }}
            <option {value}>{label}</option>
          {/each}
        </select>
      {:else}
        <p class="text-lg text-pretty">{substitueInfo}</p>
      {/if}
    </div>
    <footer class="flex gap-y-4 flex-wrap gap-x-16 justify-center">
      <ButtonFilled
        name={buttonName}
        handleClick={onClickButton}
        disabled={!hasAtLeastOneOption}
      />
    </footer>
  </div>
</Modal>

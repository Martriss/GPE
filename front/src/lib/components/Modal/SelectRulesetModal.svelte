<script lang="ts">
  import type RulesetType from "$lib/interfaces/RulesetType";
  import ButtonFilled from "../Button/ButtonFilled.svelte";
  import Modal from "./Modal.svelte";

  interface SelectGameModalProps {
    dialogRef: HTMLDialogElement;
    onClose: (e: Event) => void;
    rulesets: RulesetType[];
  }

  let {
    dialogRef = $bindable(),
    onClose,
    rulesets,
  }: SelectGameModalProps = $props();

  let hasAtLeastOneRuleset = $derived(rulesets.length > 0);
  let valueSelect: string = $state(rulesets[0].uuid ?? "");

  const createWaitingRoom = (e: Event) => {
    // faire un appel pour créer une salle d'attente "numériquement"
    // récupérer un id
    // se déplacer dans la salle
  };
</script>

<Modal bind:dialogRef {onClose}>
  <div class="flex flex-col items-center gap-8">
    <header>
      <h2 class="h2 text-wrap text-center" id="select-ruleset-label">
        A quel jeu voulez-vous jouer ?
      </h2>
    </header>
    <div>
      {#if hasAtLeastOneRuleset}
        <select
          aria-labelledby="select-ruleset-label"
          class="select"
          value={valueSelect}
          required
          size="10"
        >
          {#each rulesets as { name, uuid }}
            <option value={uuid}>{name}</option>
          {/each}
        </select>
      {:else}
        <p>Aucun jeu n'est disponible</p>
      {/if}
    </div>
    <footer class="flex gap-y-4 flex-wrap gap-x-16 justify-center">
      <ButtonFilled
        name="Créer un salon"
        handleClick={createWaitingRoom}
        disabled={!hasAtLeastOneRuleset}
      />
    </footer>
  </div>
</Modal>

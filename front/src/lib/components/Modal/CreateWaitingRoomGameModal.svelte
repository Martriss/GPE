<script lang="ts">
  import { goto } from "$app/navigation";
  import type RulesetType from "$lib/interfaces/RulesetType";
  import ButtonFilled from "../Button/ButtonFilled.svelte";
  import Modal from "./Modal.svelte";

  interface CreateWaitingRoomGameModalProps {
    dialogRef: HTMLDialogElement;
    onClose: (e: Event) => void;
    rulesets: RulesetType[];
  }

  let {
    dialogRef = $bindable(),
    onClose,
    rulesets,
  }: CreateWaitingRoomGameModalProps = $props();

  let hasAtLeastOneRuleset = $derived(rulesets.length > 0);
  // svelte-ignore state_referenced_locally
  let valueSelect: string = $state(
    hasAtLeastOneRuleset ? rulesets[0].uuid : "",
  );

  const createWaitingRoom = () => {
    const response = fetch("/api/games/", {
      method: "POST",
      body: JSON.stringify({ rulesetId: valueSelect }),
    });

    response
      .then(async (r) => {
        if (r.ok) {
          // pour récupérer les données que la requête a renvoyé
          const data = await r.json();
          goto(`/salon/${data.gameId}`);
        }
      })
      .catch((err) => {
        // Traiter le cas d'erreur
      });
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
          bind:value={valueSelect}
          required
        >
          {#each rulesets as { name, uuid }}
            <option value={uuid}>{name}</option>
          {/each}
        </select>
      {:else}
        <p class="text-lg text-pretty">Aucun jeu n'est disponible</p>
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

<script lang="ts">
  import { goto } from "$app/navigation";
  import ButtonFilled from "$lib/components/Button/ButtonFilled.svelte";
  import JoinWaitingRoomGameModal from "$lib/components/Modal/JoinWaitingRoomGameModal.svelte";
  import SelectModal from "$lib/components/Modal/SelectModal.svelte";
  import type { OptionType } from "$lib/interfaces/InputType";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();

  // svelte-ignore non_reactive_update
  let dialogRefCreateWaitingRoomGame: HTMLDialogElement;
  const options: OptionType[] = data.rulesets.map((ruleset) => {
    return {
      label: ruleset.name,
      value: ruleset.uuid,
    };
  });
  let valueInputCreateWaitingRoomGame: string = $state(
    options.length > 0 ? options[0].value : "",
  );

  // svelte-ignore non_reactive_update
  let dialogRefJoinWaitingRoomGame: HTMLDialogElement;
  let valueInputJoinWaitingRoomGame: string = $state("");

  const handleOpenCreateWaitingRoomGameModal = () => {
    dialogRefCreateWaitingRoomGame.showModal();
  };
  const handleCloseCreateWaitingRoomGameModal = () => {
    dialogRefCreateWaitingRoomGame.close();
    valueInputCreateWaitingRoomGame =
      options.length > 0 ? options[0].value : "";
  };

  const handleOpenJoinWaitingRoomGameModal = () => {
    dialogRefJoinWaitingRoomGame.showModal();
  };
  const handleCloseJoinWaitingRoomGameModal = () => {
    dialogRefJoinWaitingRoomGame.close();
    valueInputJoinWaitingRoomGame = "";
  };

  const createWaitingRoom = (e: Event) => {
    const response = fetch("/api/games/", {
      method: "POST",
      body: JSON.stringify({ rulesetId: valueInputCreateWaitingRoomGame }),
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

<div class="flex flex-col mx-4 my-8">
  <div class="flex justify-center mt-[15vh]">
    <h1 class="h1 text-center">Le Grimoire Infini</h1>
  </div>
  <div class="flex flex-col gap-[9.5vh] mt-[19vh] items-center">
    <ButtonFilled
      name="JOUER"
      handleClick={handleOpenCreateWaitingRoomGameModal}
      isLarge
    />
    <ButtonFilled
      name="REJOINDRE"
      handleClick={handleOpenJoinWaitingRoomGameModal}
      isLarge
    />
  </div>
</div>
<SelectModal
  bind:dialogRef={dialogRefCreateWaitingRoomGame}
  bind:value={valueInputCreateWaitingRoomGame}
  onClose={handleCloseCreateWaitingRoomGameModal}
  {options}
  title="A quel jeu voulez-vous jouer ?"
  buttonName="Créer un salon"
  onClickButton={createWaitingRoom}
  substitueInfo="Aucun jeu n'est disponible"
/>
<JoinWaitingRoomGameModal
  bind:dialogRef={dialogRefJoinWaitingRoomGame}
  bind:value={valueInputJoinWaitingRoomGame}
  onClose={handleCloseJoinWaitingRoomGameModal}
/>

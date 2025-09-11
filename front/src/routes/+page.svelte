<script lang="ts">
  import { goto } from "$app/navigation";
  import ButtonFilled from "$lib/components/Button/ButtonFilled.svelte";
  import JoinWaitingRoomGameModal from "$lib/components/Modal/JoinWaitingRoomGameModal.svelte";
  import SelectModal from "$lib/components/Modal/SelectModal.svelte";
  import type { OptionType } from "$lib/interfaces/InputType";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
  
  console.log("Page data:", data);
  console.log("Rulesets:", data.rulesets);

  // svelte-ignore non_reactive_update
  let dialogRefCreateWaitingRoomGame: HTMLDialogElement;
  const options: OptionType[] = data.rulesets.map((ruleset) => {
    return {
      label: ruleset.name,
      value: ruleset.id,
    };
  });
  console.log("Options mapped:", options);
  
  let valueInputCreateWaitingRoomGame: string = $state(
    options.length > 0 ? options[0].value : "",
  );
  console.log("Initial value:", valueInputCreateWaitingRoomGame);

  // svelte-ignore non_reactive_update
  let dialogRefJoinWaitingRoomGame: HTMLDialogElement;
  let valueInputJoinWaitingRoomGame: string = $state("");

  const handleOpenCreateWaitingRoomGameModal = () => {
    console.log("Opening create waiting room modal");
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

  const createWaitingRoom = async (e: Event) => {
    console.log("createWaitingRoom called with:", { 
      rulesetId: valueInputCreateWaitingRoomGame,
      options: options.length,
      event: e 
    });

    if (!valueInputCreateWaitingRoomGame) {
      console.error("No ruleset selected");
      return;
    }

    try {
      console.log("Making API request to /api/games/");
      const response = await fetch("/api/games/", {
        method: "POST",
        body: JSON.stringify({ rulesetId: valueInputCreateWaitingRoomGame }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("API response data:", data);
        handleCloseCreateWaitingRoomGameModal(); // Close the modal before navigating
        goto(`/salon/${data.gameId}`);
      } else {
        const error = await response.json();
        console.error("Error creating waiting room:", error);
        // TODO: Show user-friendly error message
      }
    } catch (err) {
      console.error("Network error creating waiting room:", err);
      // TODO: Show user-friendly error message
    }
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

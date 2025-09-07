<script lang="ts">
  import ButtonFilled from "$lib/components/Button/ButtonFilled.svelte";
  import CreateWaitingRoomGameModal from "$lib/components/Modal/CreateWaitingRoomGameModal.svelte";
  import JoinWaitingRoomGameModal from "$lib/components/Modal/JoinWaitingRoomGameModal.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();

  // svelte-ignore non_reactive_update
  let dialogRefCreateWaintingRoomGame: HTMLDialogElement;
  // svelte-ignore non_reactive_update
  let dialogRefJoinWaintingRoomGame: HTMLDialogElement;
  let valueInputJoinWaitingRoomGame: string = $state("");

  const handleOpenCreateWaintingRoomGameModal = () => {
    dialogRefCreateWaintingRoomGame.showModal();
  };
  const handleCloseCreateWaintingRoomGameModal = () => {
    dialogRefCreateWaintingRoomGame.close();
  };

  const handleOpenJoinWaintingRoomGameModal = () => {
    dialogRefJoinWaintingRoomGame.showModal();
  };
  const handleCloseJoinWaintingRoomGameModal = () => {
    dialogRefJoinWaintingRoomGame.close();
    valueInputJoinWaitingRoomGame = "";
  };
</script>

<div class="flex flex-col mx-4 my-8">
  <div class="flex justify-center mt-[15vh]">
    <h1 class="h1 text-center">Le Grimoire Infini</h1>
  </div>
  <div class="flex flex-col gap-[9.5vh] mt-[19vh] items-center">
    <ButtonFilled
      name="JOUER"
      handleClick={handleOpenCreateWaintingRoomGameModal}
      isLarge
    />
    <ButtonFilled
      name="REJOINDRE"
      handleClick={handleOpenJoinWaintingRoomGameModal}
      isLarge
    />
  </div>
</div>
<CreateWaitingRoomGameModal
  bind:dialogRef={dialogRefCreateWaintingRoomGame}
  onClose={handleCloseCreateWaintingRoomGameModal}
  rulesets={data.rulesets}
/>
<JoinWaitingRoomGameModal
  bind:dialogRef={dialogRefJoinWaintingRoomGame}
  bind:value={valueInputJoinWaitingRoomGame}
  onClose={handleCloseJoinWaintingRoomGameModal}
/>

<script lang="ts">
  import { goto } from "$app/navigation";
  import ButtonFilled from "../Button/ButtonFilled.svelte";
  import Modal from "./Modal.svelte";

  interface JoinWaitingRoomGameModalProps {
    dialogRef: HTMLDialogElement;
    onClose: (e: Event) => void;
    value?: string;
  }

  let {
    dialogRef = $bindable(),
    onClose,
    value = $bindable(""),
  }: JoinWaitingRoomGameModalProps = $props();

  let disabled: boolean = $derived(value?.length < 1);

  const joinWaitingRoom = () => {
    // Faire un check pour savoir si la salle existe ?
    // Pas pour l'instant, quand le passage par l'url direct sera protégé
    goto(`/salon/${value}`);
  };
</script>

<Modal bind:dialogRef {onClose}>
  <div class="flex flex-col items-center gap-8">
    <header>
      <h2 class="h2 text-wrap text-center" id="input-join-room-label">
        Rentrer le code du salon
      </h2>
    </header>
    <div>
      <input
        type="text"
        bind:value
        class="input"
        required
        autocomplete="off"
        aria-labelledby="input-join-room-label"
      />
    </div>
    <footer class="flex gap-y-4 flex-wrap gap-x-16 justify-center">
      <ButtonFilled
        name="Rejoindre un salon"
        handleClick={joinWaitingRoom}
        {disabled}
      />
    </footer>
  </div>
</Modal>

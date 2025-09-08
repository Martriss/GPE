<script lang="ts">
  import ButtonFilled from "$lib/components/Button/ButtonFilled.svelte";
  import CopyClipboard from "$lib/components/CopyClipboard/CopyClipboard.svelte";
  import InteractiveList from "$lib/components/List/InteractiveList.svelte";
  import type { InteractiveListItem } from "$lib/interfaces/InteractiveListType";

  // mettre par défaut l'utilisateur connecté dans les spectateurs

  const roomName: string = "Ixalan"; // Pour recevoir le nom de la salle
  const codeToJoin: string = "wRZiMSFckB2tYghtEIoE"; // Pour recevoir le code à copier
  const connectedUser: string = "Romain";
  const roomOwner: string = "Léa";
  const isRoomOwner: boolean = connectedUser === roomOwner ? true : false;
  let players: InteractiveListItem[] = $state([
    {
      key: "1",
      value: "Albert",
      isHighlighted: true,
      extraValue: "Mon super deck",
    },
    {
      key: "2",
      value: "Léa",
      isHighlighted: false,
      extraValue: "Can't loose",
    },
    {
      key: "3",
      value: "Martin",
      isHighlighted: false,
    },
    {
      key: "4",
      value: "Anastasia",
      isHighlighted: true,
    },
    {
      key: "5",
      value: "Philou",
      isHighlighted: false,
    },
    {
      key: "6",
      value: "Alain",
      isHighlighted: false,
    },
  ]); // Pour connaitre les players. Avoir sinon un map ? (du au fait que l'on map des joueurs avec des "faux joueurs" dans les règles)
  let viewers: InteractiveListItem[] = $state([]); // Pour connaitre les viewers

  const handleJoinPlayer = () => {
    // Regarder et enlever le nom dans la liste spectateur
    const index = viewers.findIndex((user) => user.key === connectedUser);
    if (index !== -1) {
      viewers.splice(index, 1);
    }
    // Ajouter l'utilisateur dans la liste des joueurs
    players.push({
      key: connectedUser,
      value: connectedUser,
      isHighlighted: true,
    });
  };

  const handleJoinViewer = () => {
    const index = players.findIndex((user) => user.key === connectedUser);
    if (index !== -1) {
      players.splice(index, 1);
    }

    viewers.push({
      key: connectedUser,
      value: connectedUser,
      isHighlighted: true,
    });
  };

  const handleLeaveRoom = () => {}; // fonction pour quitter la salle
  const handleStartGame = () => {}; // fonction pour lancer la partie
</script>

<div class="flex flex-col mx-4 my-8">
  <div class="flex justify-center">
    <h1 class="h1 mb-4 md:wb-8 md:wt-4">{roomName}</h1>
  </div>
  <br />
  <div class="flex my-8 items-center gap-x-4 flex-wrap">
    Code à partager pour rejoindre le salon&nbsp;&nbsp;-
    <span class="w-fit">
      <CopyClipboard valueToCopy={codeToJoin} />
    </span>
  </div>
  <div class="flex flex-row justify-between flex-wrap gap-y-2">
    <ButtonFilled name="Quitter le salon" handleClick={handleLeaveRoom} />
    <ButtonFilled
      name="Lancer la partie"
      handleClick={handleStartGame}
      disabled={!isRoomOwner}
    />
  </div>
  <div class="flex flex-col md:mx-12 my-8 gap-10">
    <InteractiveList
      title="Joueurs"
      items={players}
      onItemClick={() => {}}
      extraTitleButtonName="Rejoindre"
      onClickTitleButton={handleJoinPlayer}
    />
    <InteractiveList
      title="Spectateurs"
      items={viewers}
      extraTitleButtonName="Rejoindre"
      onClickTitleButton={handleJoinViewer}
    />
  </div>
</div>

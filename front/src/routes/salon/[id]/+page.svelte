<script lang="ts">
  import { goto } from "$app/navigation";
  import ButtonFilled from "$lib/components/Button/ButtonFilled.svelte";
  import CopyClipboard from "$lib/components/CopyClipboard/CopyClipboard.svelte";
  import InteractiveList from "$lib/components/List/InteractiveList.svelte";
  import ConfirmModal from "$lib/components/Modal/ConfirmModal.svelte";
  import type DeckType from "$lib/interfaces/DeckType";
  import type { InteractiveListItem } from "$lib/interfaces/InteractiveListType";
  import type { PlayerType } from "$lib/interfaces/PlayerType";
  import {
    extractPlayersFromInteractiveListItem,
    extractValueFromInteractiveListItem,
    extractValueIdentityPlayer,
  } from "$lib/utils/extract";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const roomName: string = data.room.roomName;
  const codeToJoin: string = data.room.code;
  const connectedUser: string = data.connectedUser;
  const roomOwner: string = data.room.roomOwner;
  const amIRoomOwner: boolean = connectedUser === roomOwner;
  let decksAvailable: DeckType[] = $state([]);

  const isMe = (id: string): boolean => id === connectedUser;

  const shapePlayerList = () => {
    const array: InteractiveListItem[] = [];
    data.room.ruleset.players.forEach((player: PlayerType) => {
      const valueId: string = extractValueIdentityPlayer(player);
      if (valueId !== "") {
        array.push({
          key: valueId,
          value: valueId,
          isHighlighted: isMe(valueId),
        });
      }
    });

    return array;
  };

  const shapeViewerList = () => {
    const array: InteractiveListItem[] = [];
    data.room.viewers.forEach((viewer: string) => {
      array.push({
        key: viewer,
        value: viewer,
        isHighlighted: isMe(viewer),
      });
    });

    const i = players.findIndex((user) => user.key === connectedUser);
    const j = data.room.viewers.findIndex((viewer) => viewer === connectedUser);
    if (i === -1 && j === -1) {
      array.push({
        key: connectedUser,
        value: connectedUser,
        isHighlighted: true,
      });
    }

    return array;
  };

  let players: InteractiveListItem[] = $state(shapePlayerList());
  let viewers: InteractiveListItem[] = $state(shapeViewerList());

  let nbPlayer: number = $derived(players.length);
  const nbPlayerMax: number = data.room.ruleset.players.length;

  let amIInPlayer: boolean = $derived(
    players.findIndex((user) => user.key === connectedUser) !== -1,
  );
  let amIInViewer: boolean = $derived(
    viewers.findIndex((user) => user.key === connectedUser) !== -1,
  );

  // Pour se mettre dans le tableau de players
  const beInPlayers = () => {
    //Regarder s'il est déjà dans le tableau
    if (amIInPlayer) return;

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

  // Pour se mettre dans le tableau de viewers
  const beInViewers = () => {
    if (amIInViewer) return;

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

  const handleJoinPlayer = () => {
    beInPlayers();

    try {
      data.room.ruleset.players = extractPlayersFromInteractiveListItem(
        players,
        data.room.ruleset.players,
      );
    } catch {
      // role back le changement
      beInViewers();
      return;
    }
    data.room.viewers = extractValueFromInteractiveListItem(viewers);

    const response = fetch(`/api/games/${data.room.id}`, {
      method: "PUT",
      body: JSON.stringify(data.room),
      headers: {
        "content-type": "application/json",
      },
    });

    response
      .then((r) => {
        // Permet de revenir en arrière s'il y a eu un problème lors de l'update
        if (!r.ok) {
          beInViewers();
          // Mettre une notification pour prévenir qu'un problème est arrivé lors de l'ajout
        }
      })
      .catch((err) => {
        // Traiter le cas d'erreur
      });
  };

  const handleJoinViewer = () => {
    beInViewers();

    try {
      data.room.ruleset.players = extractPlayersFromInteractiveListItem(
        players,
        data.room.ruleset.players,
      );
    } catch {
      // role back le changement
      beInPlayers();
      return;
    }
    data.room.viewers = extractValueFromInteractiveListItem(viewers);

    const response = fetch(`/api/games/${data.room.id}`, {
      method: "PUT",
      body: JSON.stringify(data.room),
      headers: {
        "content-type": "application/json",
      },
    });

    response
      .then((r) => {
        // Permet de revenir en arrière s'il y a eu un problème lors de l'update
        if (!r.ok) {
          beInPlayers();
          // Mettre une notification pour prévenir qu'un problème est arrivé lors de l'ajout
        }
      })
      .catch((err) => {
        // Traiter le cas d'erreur
      });
  };

  const actionsBeforeLeaveRoom = async () => {
    // s'enlever des tableaux
    const index = players.findIndex((user) => user.key === connectedUser);
    if (index !== -1) {
      players.splice(index, 1);
    }
    const i = viewers.findIndex((user) => user.key === connectedUser);
    if (i !== -1) {
      viewers.splice(i, 1);
    }
    // Envoyer l'information sur le serveur
    try {
      data.room.ruleset.players = extractPlayersFromInteractiveListItem(
        players,
        data.room.ruleset.players,
      );
      data.room.viewers = extractValueFromInteractiveListItem(viewers);

      await fetch(`/api/games/${data.room.id}`, {
        method: "PUT",
        body: JSON.stringify(data.room),
        headers: {
          "content-type": "application/json",
        },
      });
    } catch {
      // traiter l'erreur
    }
  };

  // svelte-ignore non_reactive_update
  let dialogConfirmLeaveRoomModal: HTMLDialogElement;
  const handleOpenModal = () => {
    dialogConfirmLeaveRoomModal.showModal();
  };
  const handleCloseModal = () => {
    dialogConfirmLeaveRoomModal.close();
  };

  const handleConfirmLeave = async () => {
    // Quand il y aura la synchronisation, renvoyé les autres utilisateurs encore présent si la salle d'attente est détruite
    const response = await fetch(`/api/games/${data.room.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Pas besoin de se retirer des tableaux parce que nous détruisons le salon
      handleCloseModal();
      goto("/");
    } else {
      // mettre une notification qu'un problème est survenu
    }
  };

  const handleLeaveRoom = () => {
    if (amIRoomOwner) {
      // Quand il y aura la synchronisation, renvoyé les autres utilisateurs encore présent si la salle d'attente est détruite
      handleOpenModal();
    } else {
      actionsBeforeLeaveRoom();
      goto("/");
    }
  };
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
      disabled={!amIRoomOwner}
    />
  </div>
  <!-- <p class="mt-4 h6">{data.room.ruleset.name}</p> -->
  <div class="flex flex-col md:mx-12 my-8 gap-10">
    <InteractiveList
      title="Joueur"
      subtitle={`${nbPlayer}/${nbPlayerMax}`}
      items={players}
      onItemClick={() => {}}
      extraTitleButtonName="Rejoindre"
      onClickTitleButton={handleJoinPlayer}
      disabledExtraButton={nbPlayer === nbPlayerMax || amIInPlayer}
    />
    <InteractiveList
      title="Spectateurs"
      items={viewers}
      extraTitleButtonName="Rejoindre"
      onClickTitleButton={handleJoinViewer}
      disabledExtraButton={amIInViewer}
    />
  </div>
</div>
<ConfirmModal
  bind:dialogRef={dialogConfirmLeaveRoomModal}
  title="Quitter le salon"
  question="Si vous continuez, le salon se fermera aussi pour les autres. Voulez-vous continuer ?"
  onCloseTrue={handleConfirmLeave}
  onCloseFalse={handleCloseModal}
/>

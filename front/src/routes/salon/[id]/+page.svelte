<script lang="ts">
  import { goto } from "$app/navigation";
  import ButtonFilled from "$lib/components/Button/ButtonFilled.svelte";
  import CopyClipboard from "$lib/components/CopyClipboard/CopyClipboard.svelte";
  import InteractiveList from "$lib/components/List/InteractiveList.svelte";
  import ConfirmModal from "$lib/components/Modal/ConfirmModal.svelte";
  import SelectModal from "$lib/components/Modal/SelectModal.svelte";
  import type DeckType from "$lib/interfaces/DeckType";
  import type { SubDeckTypeForGame } from "$lib/interfaces/GameType";
  import type { OptionType } from "$lib/interfaces/InputType";
  import type { InteractiveListItem } from "$lib/interfaces/InteractiveListType";
  import type { PlayerType } from "$lib/interfaces/PlayerType";
  import {
    extractPlayersFromInteractiveListItem,
    extractValueFromInteractiveListItem,
    extractValueIdentityPlayer,
  } from "$lib/utils/extract";
  import { findUserPlayerFromPlayers } from "$lib/utils/search";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const roomName: string = data.room.roomName;
  const codeToJoin: string = data.room.code;
  const connectedUser: string = data.connectedUser;
  const roomOwner: string = data.room.roomOwner;
  const amIRoomOwner: boolean = connectedUser === roomOwner;

  const isMe = (id: string): boolean => id === connectedUser;

  const shapePlayerList = () => {
    const array: InteractiveListItem[] = [];
    data.room.ruleset.players.forEach((player: PlayerType) => {
      const valueId: string = extractValueIdentityPlayer(player);
      if (valueId !== "") {
        const deck = data.room.decks.find((deck) => deck.playerId === valueId);
        array.push({
          key: valueId,
          value: valueId,
          isHighlighted: isMe(valueId),
          ...(deck ? { extraValue: deck.name } : {}),
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
    removeMyDeckInRoomDecks(); // enlever mon deck si j'en avais choisi un en tant que joueur

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
    // Enlever un deck choisi si nous étions joueur
    removeMyDeckInRoomDecks();
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
  const handleOpenConfirmLeaveModal = () => {
    dialogConfirmLeaveRoomModal.showModal();
  };
  const handleCloseConfirmLeaveModal = () => {
    dialogConfirmLeaveRoomModal.close();
  };

  const handleConfirmLeave = async () => {
    // Quand il y aura la synchronisation, renvoyé les autres utilisateurs encore présent si la salle d'attente est détruite
    const response = await fetch(`/api/games/${data.room.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Pas besoin de se retirer des tableaux parce que nous détruisons le salon
      handleCloseConfirmLeaveModal();
      goto("/");
    } else {
      // mettre une notification qu'un problème est survenu
    }
  };

  const handleLeaveRoom = () => {
    if (amIRoomOwner) {
      // Quand il y aura la synchronisation, renvoyé les autres utilisateurs encore présent si la salle d'attente est détruite
      handleOpenConfirmLeaveModal();
    } else {
      actionsBeforeLeaveRoom();
      goto("/");
    }
  };

  // svelte-ignore non_reactive_update
  let dialogSelectDeckModal: HTMLDialogElement;
  const handleOpenSelectDeckModal = () => {
    dialogSelectDeckModal.showModal();
  };
  const handleCloseSelectDeckModal = () => {
    dialogSelectDeckModal.close();
    valueDeckChoose = "";
  };

  let decksAvailable: DeckType[] = $state([]);
  let optionsDecksAvailable: OptionType[] = $derived(
    decksAvailable.map((deck: DeckType) => ({
      label: deck.name,
      value: deck.id ?? "",
    })),
  );
  let valueDeckChoose: string = $state("");

  const handleChooseUrDeck = async () => {
    // Regarder si l'utilisateur est déjà dans la liste
    const userPlayer = findUserPlayerFromPlayers(
      connectedUser,
      data.room.ruleset.players,
    );
    if (!userPlayer) return; // Normalement on ne devrait jamais arrivé ici

    // récupérer les decks disponibles
    const response = await fetch(
      `/api/decks/available-for-game?rulesetId=${data.room.ruleset.id}&minSizeDeck=${userPlayer.minSizeDeck}&maxSizeDeck=${userPlayer.maxSizeDeck}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      // afficher une notification pour signaler l'erreur
      return;
    }
    const resData = await response.json();
    decksAvailable = resData.decks;

    handleOpenSelectDeckModal();
  };

  const removeMyDeckInRoomDecks = () => {
    const i = data.room.decks.findIndex(
      (deck: SubDeckTypeForGame) => deck.playerId === connectedUser,
    );
    if (i !== -1) {
      const elSup = data.room.decks.splice(i, 1);
      return elSup[0];
    }
  };

  const handleConfirmSelectDeck = () => {
    if (!amIInPlayer || valueDeckChoose === "") return; // Normalement on ne devrait jamais arrivé ici

    const deck = decksAvailable.find((deck) => deck.id === valueDeckChoose);
    if (!deck) {
      // afficher une notification pour signaler l'erreur
      return;
    }

    // Supprimer l'ancien deck si l'utilisateur a déjà un deck
    const oldDeck = removeMyDeckInRoomDecks();

    // ajouter le nouveau
    data.room.decks.push({
      ...deck,
      playerId: connectedUser,
    });
    for (let i = 0; i < players.length; i++) {
      if (players[i].key === connectedUser) {
        players[i].extraValue = deck.name;
        break;
      }
    }

    const response = fetch(`/api/games/${data.room.id}`, {
      method: "PUT",
      body: JSON.stringify(data.room),
      headers: {
        "content-type": "application/json",
      },
    });

    response
      .then((r) => {
        if (!r.ok) {
          // Je ne passe pas par un pop car avec la "synchronisation" je ne sais pas ce sera toujours le dernier item
          removeMyDeckInRoomDecks();
          if (oldDeck) {
            data.room.decks.push(oldDeck);
          }

          for (let i = 0; i < players.length; i++) {
            if (players[i].key === connectedUser) {
              if (oldDeck) {
                players[i].extraValue = oldDeck.name;
              } else {
                delete players[i].extraValue;
              }
            }
          }
          // Mettre une notication pour prévenir qu'un problème est arrivé lors de l'ajout
        }
      })
      .catch((err) => {
        // Traiter le cas d'erreur
      });

    handleCloseSelectDeckModal();
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
      disabled={true}
    />
    <!-- Dans le bouton au-dessus remplacer "true" par "!amIRoomOwner" quand le lien avec le ruleset sera fait-->
  </div>
  <!-- <p class="mt-4 h6">{data.room.ruleset.name}</p> -->
  <div class="flex flex-col md:mx-12 my-8 gap-10">
    <InteractiveList
      title="Joueur"
      subtitle={`${nbPlayer}/${nbPlayerMax}`}
      items={players}
      onItemClick={handleChooseUrDeck}
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
  onCloseFalse={handleCloseConfirmLeaveModal}
/>
<SelectModal
  bind:dialogRef={dialogSelectDeckModal}
  onClose={handleCloseSelectDeckModal}
  title="Sélectionner votre deck pour jouer"
  buttonName="Choisir celui-ci"
  onClickButton={handleConfirmSelectDeck}
  substitueInfo="Aucun deck n'est disponible"
  options={optionsDecksAvailable}
  bind:value={valueDeckChoose}
/>

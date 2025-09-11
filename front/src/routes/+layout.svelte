<script lang="ts">
	import "../app.css";
	import Swords from "@lucide/svelte/icons/swords";
	import BookOpenText from "@lucide/svelte/icons/book-open-text";
	import Layers from "@lucide/svelte/icons/layers";
	import DropListNav from "$lib/components/DropList/DropListNav.svelte";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();

	const gameActions = [
		{ display: "Créer une partie", href: "#" },
		{ display: "Rejoindre une partie", href: "#" },
		{ display: "Prototype 3D", href: "/game" },
	];
	const ruleActions = [
		{ display: "Créer une règle", href: "#" },
		{ display: "Trouver un jeu", href: "#" },
	];
	const deckActions = [
		{
			display: "Construire un deck",
			href: "/decks/creation",
		},
		{
			display: "Accéder à mes decks",
			href: "/decks/mes-decks",
		},
		{
			display: "Accéder aux decks publics",
			href: "/decks",
		},
	];

	const iconSize = 28;
</script>

<header class="my-3 mx-10">
	<nav class="flex items-center justify-between">
		<a href="/" class="text-xl">Home</a>
		<DropListNav
			linkList={gameActions}
			ariaLabel="Ouvrir la liste déroulante pour créer ou rejoindre une partie"
		>
			<Swords size={iconSize} />
		</DropListNav>
		<DropListNav
			linkList={ruleActions}
			ariaLabel="Ouvrir la liste déroulante pour créer ou trouver une règle de jeu"
			disabled
		>
			<BookOpenText size={iconSize} />
		</DropListNav>
		<DropListNav
			linkList={deckActions}
			ariaLabel="Ouvrir la liste déroulante pour construire ou consulter un deck"
		>
			<Layers size={iconSize} />
		</DropListNav>
		{#if data.isConnected}
			<form action="/?/logout" method="POST">
				<button>Déconnexion</button>
			</form>
		{:else}
			<a href="/signin">Connexion</a>
		{/if}
	</nav>
</header>

{@render children()}

<script lang="ts">
  import { onDestroy, onMount, type Snippet } from "svelte";

  interface DropListNavProps {
    linkList: {
      display: string;
      href: string;
    }[];
    ariaLabel?: string;
    disabled?: boolean;
    children: Snippet<[]>;
  }

  let {
    linkList,
    ariaLabel,
    children,
    disabled = false,
  }: DropListNavProps = $props();
  let isShow: boolean = $state(false);

  // svelte-ignore non_reactive_update
  let dropListNavRef: HTMLDivElement;

  const handleButton = () => {
    isShow = !isShow;
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropListNavRef &&
      e.target instanceof Node &&
      !dropListNavRef.contains(e.target)
    ) {
      isShow = false;
    }
  };

  onMount(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("click", handleClickOutside);
    }
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("click", handleClickOutside);
    }
  });
</script>

<div bind:this={dropListNavRef} class="dropdown">
  <button aria-label={ariaLabel} onclick={handleButton} {disabled}
    >{@render children()}</button
  >
  <div
    data-testid="drop-list-nav-child"
    class="dropdown-child bg-(--body-background-color) dark:bg-(--body-background-color-dark)
    {isShow ? 'block' : 'hidden'}"
  >
    {#each linkList as { display, href }}
      <a {href} class="my-2 mx-3" onclick={handleButton}>{display}</a>
    {/each}
  </div>
</div>

<style>
  .dropdown {
    max-height: 28px;
  }
  .dropdown-child {
    /* display: none; */
    position: absolute;
    border: solid 1px;
    border-radius: 0.5em;
  }
  .dropdown-child a {
    text-decoration: none;
    display: block;
  }
  .dropdown-child a:hover {
    text-decoration: underline;
  }
  /* .dropdown:hover .dropdown-child {
    display: block;
  } */
</style>

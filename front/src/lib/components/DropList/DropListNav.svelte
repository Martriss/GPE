<script lang="ts">
  import type { Snippet } from "svelte";

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

  const handleButton = () => {
    isShow = !isShow;
  };
</script>

<div class="dropdown test">
  <button aria-label={ariaLabel} onclick={handleButton} {disabled}
    >{@render children()}</button
  >
  <div class="dropdown-child {isShow ? 'block' : 'hidden'}">
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
    background-color: var(--body-background-color);
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

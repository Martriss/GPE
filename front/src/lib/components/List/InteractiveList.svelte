<script lang="ts">
  import type { InteractiveListItem } from "$lib/interfaces/InteractiveListType";
  import CirclePlus from "@lucide/svelte/icons/circle-plus";
  import Repeat from "@lucide/svelte/icons/repeat";
  import ButtonFilled from "../Button/ButtonFilled.svelte";

  interface InteractiveListProps {
    title: string;
    extraTitleButtonName?: string;
    onClickTitleButton?: (e: Event) => void;
    items: InteractiveListItem[];
    onItemClick?: (e: Event) => void;
  }

  let {
    title,
    items,
    onItemClick,
    extraTitleButtonName,
    onClickTitleButton,
  }: InteractiveListProps = $props();
</script>

<div>
  <div class="flex flex-row gap-8 md:gap-20 items-center mb-2">
    <h4 class="h4 w-35">{title}</h4>
    {#if extraTitleButtonName && onClickTitleButton}
      <ButtonFilled
        name={extraTitleButtonName}
        handleClick={onClickTitleButton}
      />
    {/if}
  </div>
  <ul class="list-disc text-lg mx-8">
    {#each items as item (item.key)}
      <li class={item.isHighlighted ? "text-secondary-500" : ""}>
        <div class="flex items-center gap-4">
          {item.value}
          {#if item.isHighlighted && onItemClick}
            <button
              class="btn"
              onclick={onItemClick}
              data-keyitem={item.key}
              aria-label="choisir un deck"
            >
              {#if !item.extraValue}
                <CirclePlus />
              {:else}
                <Repeat />
              {/if}
            </button>
          {/if}
          {#if item.extraValue}
            <span>-</span>
            <span class="text-base italic">{item.extraValue}</span>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</div>

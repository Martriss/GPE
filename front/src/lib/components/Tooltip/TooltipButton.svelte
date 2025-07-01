<script lang="ts">
  import ButtonFilled from "../Button/ButtonFilled.svelte";

  interface TooltipButtonProps {
    infoOnHover: string;
    infoOnClick: string;
    nameButton: string;
    handleClickButton: (e: Event) => void;
  }

  let {
    infoOnHover,
    infoOnClick,
    nameButton,
    handleClickButton,
  }: TooltipButtonProps = $props();

  let isOnClick: boolean = $state(false);
  let showTooltip: boolean = $state(false);
  let hasToShow: boolean = $state(true);

  const handleClick = (e: Event) => {
    handleClickButton(e);
    isOnClick = true;
    showTooltip = true;
    hasToShow = false;
    setTimeout(() => {
      if (!hasToShow) showTooltip = false;
    }, 1000);
  };

  const handleMouseEnter = () => {
    isOnClick = false;
    hasToShow = true;
    showTooltip = true;
  };

  const handleMouseLeave = () => {
    showTooltip = false;
  };
</script>

<div
  class="tooltip-div"
  role="tooltip"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
>
  {#if showTooltip}
    <span
      class="tooltip-child text-white dark:text-black bg-[#333] dark:bg-[#f0f0f0]"
    >
      {#if isOnClick}
        {infoOnClick}
      {:else}
        {infoOnHover}
      {/if}
    </span>
  {/if}

  <ButtonFilled name={nameButton} {handleClick} />
</div>

<style>
  .tooltip-div {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .tooltip-child {
    text-align: center;
    padding: 6px 8px;
    border-radius: 4px;
    position: absolute;
    z-index: 1;
    bottom: 125%; /* Position au-dessus */
    left: 50%;
    transform: translateX(-50%);
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
    white-space: nowrap;
  }
</style>

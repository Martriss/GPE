<script>
    import DividerWithText from "$lib/components/Divider/DividerWithText.svelte";
    import ButtonSubmitCustom from "$lib/components/Form/ButtonSubmitCustom.svelte";
</script>

<h1>Welcome to SvelteKit</h1>
<form method="POST" action="?/createZones">
    <ButtonSubmitCustom name="ADD ZONE" />
</form>

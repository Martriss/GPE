<script lang="ts">
  interface InputRadioCustomProps {
    label: string;
    name: string;
    value: string;
    checked?: boolean;
  }

  let { label, name, checked, value }: InputRadioCustomProps = $props();
</script>

<label class="flex items-center space-x-1 border rounded-md px-2 py-1">
  <input class="radio" type="radio" {checked} {name} {value} />
  <p>{label}</p>
</label>

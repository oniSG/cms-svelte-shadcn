<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	const codes = [
		{ value: '+420', label: '+420', image: '/flags/cz.svg' },
		{ value: '+44', label: '+44', image: '/flags/gb.svg' },
		{ value: '+49', label: '+49', image: '/flags/de.svg' }
	];

	let { value = $bindable('+420') }: { value?: string } = $props();
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger class="w-min-content pr-7">
		<img src={codes.find((c) => c.value === value)?.image} alt={value} class="size-4 rounded-sm" />
		<span>{codes.find((c) => c.value === value)?.label}</span>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Phone Codes</Select.Label>
			{#each codes as code (code.value)}
				<Select.Item value={code.value} label={code.label}>
					<img src={code.image} alt={code.label} class="size-4 rounded-sm" />
					<span>{code.label}</span>
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

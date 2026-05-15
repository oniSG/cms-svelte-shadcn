<script lang="ts">
	import type { ControlAttrs } from 'formsnap';
	import * as Select from '$lib/components/ui/select/index.js';

	const countries = [
		{ value: 'czech', label: 'Czech Republic', image: '/flags/cz.svg' },
		{ value: 'germany', label: 'Germany', image: '/flags/de.svg' },
		{ value: 'great-britain', label: 'Great Britain', image: '/flags/gb.svg' }
	];

	type Props = Partial<ControlAttrs> & { value?: string };
	let { value = $bindable(''), ...restProps }: Props = $props();
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger class="w-full" {...restProps}>
		<div class="flex items-center gap-2">
			<img
				src={countries.find((c) => c.value === value)?.image}
				alt={value}
				class="size-4 rounded-sm"
			/>
			<span>{countries.find((c) => c.value === value)?.label}</span>
		</div>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Countries</Select.Label>
			{#each countries as country (country.value)}
				<Select.Item value={country.value} label={country.label}>
					<img src={country.image} alt={country.label} class="size-4 rounded-sm" />
					<span>{country.label}</span>
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

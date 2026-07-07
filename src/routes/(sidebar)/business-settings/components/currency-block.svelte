<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as m from '$lib/paraglide/messages.js';

	let { name, item } = $props();
	let decimals = $state('2');

	type Separator = 'space' | 'comma' | 'dot';
	let separator = $state<Separator>('space');
	const separatorLabels: Record<Separator, string> = {
		space: m.common_space(),
		comma: m.common_comma(),
		dot: m.common_dot()
	};

	type SmallSeparator = 'comma' | 'dot';
	let smallSeparator = $state<SmallSeparator>('comma');
	const smallSeparatorLabels: Record<SmallSeparator, string> = {
		comma: m.common_comma(),
		dot: m.common_dot()
	};
</script>

<Accordion.Item value={item}>
	<Accordion.Trigger>{name}</Accordion.Trigger>

	<Accordion.Content class="flex flex-col gap-4 text-balance">
		<div class="flex flex-wrap gap-2 text-balance">
			<Select.Root type="single" bind:value={decimals}>
				<Select.Trigger>
					{m.nav_set_biz_decimal_places()} - {decimals}
				</Select.Trigger>

				<Select.Content>
					{#each ['0', '1', '2', '3', '4', '5'] as value}
						<Select.Item {value}>
							{value}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<Select.Root type="single" bind:value={separator}>
				<Select.Trigger>
					{m.nav_set_biz_thousands_separator()} - {separatorLabels[separator]}
				</Select.Trigger>

				<Select.Content>
					{#each Object.entries(separatorLabels) as [value, label]}
						<Select.Item {value}>
							{label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<Select.Root type="single" bind:value={smallSeparator}>
				<Select.Trigger>
					{m.nav_set_biz_decimal_separator()} - {smallSeparatorLabels[smallSeparator]}
				</Select.Trigger>

				<Select.Content>
					{#each Object.entries(smallSeparatorLabels) as [value, label]}
						<Select.Item {value}>
							{label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex items-center space-x-2">
			<Checkbox id="terms" />
			<Label for="terms">{m.nav_set_biz_currency_sign_before()}</Label>
		</div>
	</Accordion.Content>
</Accordion.Item>

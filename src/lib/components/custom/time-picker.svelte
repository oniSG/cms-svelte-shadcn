<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	let {
		value = $bindable(''),
		id,
		placeholder = '00:00',
		class: className = ''
	}: {
		value?: string;
		id?: string;
		placeholder?: string;
		class?: string;
	} = $props();

	const fallbackId = $props.id();
	const triggerId = $derived(id ?? `${fallbackId}-time`);

	let open = $state(false);

	const timeInputClass =
		'bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none';

	function displayTime(time: string): string {
		if (!time) return placeholder;
		return time.length >= 5 ? time.slice(0, 5) : time;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger {id} class="w-full {className}">
		{#snippet child({ props })}
			<Button
				{...props}
				id={triggerId}
				variant="outline"
				class="w-full justify-between border border-border bg-background font-normal"
			>
				<span class:text-muted-foreground={!value}>{displayTime(value)}</span>
				<ChevronDown class="size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-3" align="start">
		<Input type="time" bind:value class={timeInputClass} />
	</Popover.Content>
</Popover.Root>

<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import XIcon from '@lucide/svelte/icons/x';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { tagColorClass } from '$lib/components/custom/table-page/cells/tag-color';
	import { cn } from '$lib/utils.js';

	type Option = string | { value: string; label: string };

	let {
		value = $bindable<string[]>([]),
		options,
		placeholder,
		searchPlaceholder,
		emptyText = 'No results.',
		id,
		class: className
	}: {
		value?: string[];
		options: readonly Option[];
		placeholder: string;
		searchPlaceholder?: string;
		emptyText?: string;
		id?: string;
		class?: string;
	} = $props();

	let open = $state(false);

	const normalized = $derived(
		options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option))
	);

	function labelFor(item: string) {
		return normalized.find((option) => option.value === item)?.label ?? item;
	}

	function toggle(item: string) {
		value = value.includes(item) ? value.filter((v) => v !== item) : [...value, item];
	}

	function remove(item: string, event: MouseEvent) {
		event.stopPropagation();
		value = value.filter((v) => v !== item);
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger {id}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class={cn(
					'h-auto min-h-9 w-full flex-wrap justify-between gap-1 rounded-3xl border-transparent bg-input/50 px-3 py-1 font-normal whitespace-normal shadow-none hover:bg-input/50',
					className
				)}
				role="combobox"
				aria-expanded={open}
			>
				<span class="flex min-w-0 flex-1 flex-wrap items-center gap-1">
					{#each value as item (item)}
						<Badge variant="outline" class="gap-1 pr-1 font-medium {tagColorClass(item)}">
							{labelFor(item)}
							<button
								type="button"
								onclick={(event) => remove(item, event)}
								class="hover:text-destructive"
							>
								<XIcon class="size-3" />
							</button>
						</Badge>
					{:else}
						<span class="text-muted-foreground">{placeholder}</span>
					{/each}
				</span>
				<ChevronsUpDownIcon class="size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content align="start" class="w-[var(--bits-popover-anchor-width)] p-0">
		<Command.Root>
			<Command.Input placeholder={searchPlaceholder ?? placeholder} />
			<Command.List>
				<Command.Empty>{emptyText}</Command.Empty>
				<Command.Group>
					{#each normalized as option (option.value)}
						<Command.Item
							value={option.value}
							onSelect={() => {
								toggle(option.value);
								open = true;
							}}
						>
							<CheckIcon
								class={cn('size-4', !value.includes(option.value) && 'text-transparent')}
							/>
							{option.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>

<script lang="ts">
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { getLocalTimeZone, today } from '@internationalized/date';

	type Props = {
		uniqueEvents: Set<string>;
		uniqueTags: Set<string>;
		uniquePeople: Set<string>;
		dateRange?: { start: any; end: any };
	};

	let { uniqueEvents, uniqueTags, uniquePeople, dateRange = $bindable() }: Props = $props();

	const start = today(getLocalTimeZone());
	const end = start.add({ days: 7 });

	let value = $state(dateRange ?? { start, end });
</script>

<div class="flex flex-row gap-2">
	<ButtonGroup.Root orientation="horizontal" aria-label="Filtry" class="h-fit">

		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" size="sm" {...props}>Název</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="p-0 w-56">
				<Command.Root>
					<Command.Input placeholder="Hledat..." />
					<Command.List>
						<Command.Empty>Žádné výsledky.</Command.Empty>
						<Command.Group heading="Události">
							{#each uniqueEvents as event (event)}
								<Command.Item>{event}</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>

		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" size="sm" {...props}>Štítky</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="p-0 w-56">
				<Command.Root>
					<Command.Input placeholder="Hledat..." />
					<Command.List>
						<Command.Empty>Žádné výsledky.</Command.Empty>
						<Command.Group heading="Štítky">
							{#each uniqueTags as tag (tag)}
								<Command.Item>{tag}</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>

		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" size="sm" {...props}>Vytvořil/a</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="p-0 w-56">
				<Command.Root>
					<Command.Input placeholder="Hledat..." />
					<Command.List>
						<Command.Empty>Žádné výsledky.</Command.Empty>
						<Command.Group heading="Osoby">
							{#each uniquePeople as person (person)}
								<Command.Item>{person}</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>

		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" size="sm" {...props}>Datum vytvoření</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="p-0">
				<RangeCalendar bind:value class="rounded-md border" />
			</Popover.Content>
		</Popover.Root>

		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" size="sm" {...props}>Aktivní</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="p-0 w-56">
				<Command.Root>
					<Command.List>
						<Command.Group heading="Stav">
							<Command.Item>Všechny</Command.Item>
							<Command.Item>Aktivní</Command.Item>
							<Command.Item>Neaktivní</Command.Item>
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>

	</ButtonGroup.Root>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" size="sm">
					<Settings2Icon />
					View
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.CheckboxItem>Název</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem>Štítky</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem>Vytvořil/a</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem>Datum vytvoření</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem>Aktivní</DropdownMenu.CheckboxItem>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
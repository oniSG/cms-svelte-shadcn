<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	type Props = {
		currentPage: number;
		totalPages: number;
		maxItemsPerPage: number;
	};

	let {
		currentPage = $bindable(),
		totalPages,
		maxItemsPerPage = $bindable(),
	}: Props = $props();
</script>

<div class="flex items-center justify-between mt-2 mb-6">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" size="sm">
					{maxItemsPerPage} items per page
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="start">
			{#each [10, 20, 30, 50] as size (size)}
				<DropdownMenu.Item onclick={() => { maxItemsPerPage = size; currentPage = 1; }}>
					{size}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<ButtonGroup.Root>
		<Button
			variant="outline" size="icon" class="size-8"
			disabled={currentPage <= 1}
			onclick={() => currentPage -= 1}
		>
			<ChevronLeftIcon class="size-4" />
		</Button>
		<Button variant="outline" class="size-8 px-8 pointer-events-none">
			<span class="text-sm">{currentPage} / {totalPages}</span>
		</Button>
		<Button
			variant="outline" size="icon" class="size-8"
			disabled={currentPage >= totalPages}
			onclick={() => currentPage += 1}
		>
			<ChevronRightIcon class="size-4" />
		</Button>
	</ButtonGroup.Root>
</div>
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { NavItem } from '$lib/types/sidebar';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	let { item }: { item: NavItem } = $props();

	let userOpen = $state(false);
	const open = $derived(item.isActive || userOpen);
</script>

<Collapsible.Root {open} onOpenChange={(v) => (userOpen = v)} class="group/collapsible">
	{#snippet child({ props })}
		<Sidebar.MenuItem {...props}>
			<Collapsible.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton {...props} isActive={item.isActive} tooltipContent={item.title}>
						{#if item.icon}
							<item.icon />
						{/if}
						<span>{item.title}</span>
						<ChevronRightIcon
							class="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
						/>
					</Sidebar.MenuButton>
				{/snippet}
			</Collapsible.Trigger>
			<Collapsible.Content>
				<Sidebar.MenuSub>
					{#each item.items ?? [] as subItem (subItem.title)}
						<Sidebar.MenuSubItem>
							<Sidebar.MenuSubButton isActive={subItem.isActive}>
								{#snippet child({ props })}
									<a href={resolve(subItem.url as Pathname)} {...props}>
										<span>{subItem.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuSubButton>
						</Sidebar.MenuSubItem>
					{/each}
				</Sidebar.MenuSub>
			</Collapsible.Content>
		</Sidebar.MenuItem>
	{/snippet}
</Collapsible.Root>

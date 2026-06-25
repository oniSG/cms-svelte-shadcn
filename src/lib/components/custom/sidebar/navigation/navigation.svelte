<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import type { NavItem } from '$lib/types/sidebar';
	import { cn } from '$lib/utils.js';
	import NavCollapsibleItem from './nav-collapsible-item.svelte';

	let { label, items }: { label?: string; items: NavItem[] } = $props();

	const sidebar = useSidebar();
</script>

<Sidebar.Group>
	{#if label}
		<Sidebar.GroupLabel>{label}</Sidebar.GroupLabel>
	{/if}
	<Sidebar.Menu>
		{#each items as item (item.title)}
			{#if item.items && item.items.length > 0}
				{#if sidebar.state === 'collapsed'}
					<Sidebar.MenuItem>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props} isActive={item.isActive}>
										{#if item.icon}
											<item.icon />
										{/if}
										<span>{item.title}</span>
									</Sidebar.MenuButton>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content
								side="right"
								align="start"
								sideOffset={4}
								class="min-w-48 rounded-lg"
							>
								<DropdownMenu.Label class="text-xs text-muted-foreground">
									{item.title}
								</DropdownMenu.Label>
								<DropdownMenu.Separator />
								{#each item.items as subItem (subItem.title)}
									<DropdownMenu.Item>
										{#snippet child({ props })}
											<a
												href={resolve(subItem.url as Pathname)}
												{...props}
												data-active={subItem.isActive ? '' : undefined}
												class={cn(
													props.class as string | undefined,
													subItem.isActive && 'bg-accent text-accent-foreground'
												)}
											>
												{subItem.title}
											</a>
										{/snippet}
									</DropdownMenu.Item>
								{/each}
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Sidebar.MenuItem>
				{:else}
					<NavCollapsibleItem {item} />
				{/if}
			{:else}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton
						isActive={item.isActive}
						tooltipContent={item.title}
						tooltipContentProps={{ arrowClasses: 'hidden' }}
					>
						{#snippet child({ props })}
							<a href={resolve(item.url as Pathname)} {...props}>
								{#if item.icon}
									<item.icon />
								{/if}
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/if}
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>

<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { moduleState } from '$lib/stores/module.svelte';
	import type { Module } from '$lib/types/sidebar';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import Settings2Icon from '@lucide/svelte/icons/settings-2';
	import BriefcaseBusinessIcon from '@lucide/svelte/icons/briefcase-business';
	import UsersRoundIcon from '@lucide/svelte/icons/users-round';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { twMerge } from 'tailwind-merge';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';

	const sidebar = useSidebar();

	type ModuleConfig = {
		id: Module;
		label: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: any;
	};

	const modules = $derived<ModuleConfig[]>([
		{ id: 'business', label: m.sidebar_module_business(), icon: BriefcaseBusinessIcon },
		{ id: 'fans', label: m.sidebar_module_fans(), icon: UsersRoundIcon },
		{ id: 'settings', label: m.sidebar_module_settings(), icon: Settings2Icon }
	]);

	const current = $derived(modules.find((mod) => mod.id === moduleState.current)!);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="group/switcher hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar.Root>
							<Avatar.Image
								src="https://cdn.deepvision.cloud/relatoo/logo/facr.svg?v=2"
								alt="@shadcn"
							/>
							<Avatar.Fallback>CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">FACR</span>
							<span class="truncate text-xs tracking-wide opacity-60">{current.label}</span>
						</div>
						<ChevronsUpDownIcon class="ms-auto size-4 shrink-0 opacity-50" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-xs text-muted-foreground">FACR</DropdownMenu.Label>
				<div class="flex items-center px-2 py-1">
					<Badge variant="secondary" class="text-xs">Pro</Badge>
					<Separator orientation="vertical" class="mx-2 min-h-3" />
					<span class="text-xs text-muted-foreground">664 / 1000 fans</span>
				</div>
				<DropdownMenu.Separator />
				<DropdownMenu.Label class="text-xs text-muted-foreground">
					{m.sidebar_switch_module()}
				</DropdownMenu.Label>
				{#each modules as mod (mod.id)}
					<DropdownMenu.Item
						onSelect={() => (moduleState.current = mod.id)}
						data-active={moduleState.current === mod.id}
						class={twMerge(
							'gap-2 p-2',
							moduleState.current === mod.id && 'bg-sidebar-accent text-sidebar-accent-foreground'
						)}
					>
						<div class="flex size-6 items-center justify-center rounded-md border">
							<mod.icon class="size-3.5" />
						</div>
						<span class="flex-1">{mod.label}</span>
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>

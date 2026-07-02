<script lang="ts">
	import { page } from '$app/state';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import InfoDrawer from '$lib/components/custom/info-drawer.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { cn } from '$lib/utils.js';
	import { data } from '../data.js';
	import {
		FAN_ACTION_EDIT_TABS,
		fanActionEditTabHref,
		isFanActionEditTab,
		type FanActionEditTab
	} from '../edit-tabs.js';
	import ChartColumn from '@lucide/svelte/icons/chart-column';
	import * as m from '$lib/paraglide/messages.js';

	let { children } = $props();

	const actionId = $derived(Number(page.params.id));
	const action = $derived(data.find((item) => item.id === actionId));

	const activeTab = $derived.by(() => {
		const segment = page.url.pathname.split('/').at(-1) ?? '';
		return isFanActionEditTab(segment) ? segment : 'settings';
	});

	const tabLabels: Record<FanActionEditTab, () => string> = {
		settings: () => m.fan_action_tab_settings(),
		stats: () => m.fan_action_tab_stats()
	};

	const editTabTriggerClass =
		'gap-2 rounded-full border border-transparent! px-3 py-1 text-sm font-medium text-foreground/60 hover:text-foreground relative inline-flex h-[calc(100%-1px)] items-center justify-center whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring data-active:bg-background data-active:text-foreground';

	const isSettingsTab = $derived(activeTab === 'settings');

	function handleSave() {
		console.log('save fan action', actionId);
	}
</script>

<PageHeader
	breadcrumbs={[
		{ title: 'Home', url: '/' },
		{ title: 'Fans' },
		{ title: m.nav_fans_campaigns(), url: '/fan-action' },
		...(action ? [{ title: action.event }] : []),
		{ title: m.fan_action_edit_title() }
	]}
>
	{#if action}
		<InfoDrawer title={m.fan_action_edit_title()}>
			<p class="text-sm text-muted-foreground">{m.fan_action_info_description()}</p>
		</InfoDrawer>
		<Button variant="outline" size="sm" href={fanActionEditTabHref(actionId, 'stats')}>
			<ChartColumn />
			{m.nav_analytics()}
		</Button>
		<Button size="sm" onclick={handleSave}>{m.save()}</Button>
	{/if}
</PageHeader>

{#if !action}
	<p class="text-muted-foreground">{m.fan_action_not_found()}</p>
{:else}
	<div
		class={cn(
			'flex flex-col',
			isSettingsTab && '-mb-4 h-[calc(100svh-3.5rem)] overflow-x-hidden overflow-y-hidden'
		)}
	>
		<!--
		<div class="flex shrink-0 justify-start px-4 pt-3">
			<Tabs.Root value={activeTab}>
				<Tabs.List class="w-fit shrink-0">
					{#each FAN_ACTION_EDIT_TABS as tab (tab)}
						<a
							href={fanActionEditTabHref(actionId, tab)}
							data-slot="tabs-trigger"
							data-active={activeTab === tab ? true : undefined}
							aria-current={activeTab === tab ? 'page' : undefined}
							class={editTabTriggerClass}
						>
							{tabLabels[tab]()}
						</a>
					{/each}
				</Tabs.List>
			</Tabs.Root>
		</div>
		-->

		<div class={cn(isSettingsTab ? 'min-h-0 flex-1' : 'px-4 pt-4 pb-8')}>
			{@render children()}
		</div>
	</div>
{/if}

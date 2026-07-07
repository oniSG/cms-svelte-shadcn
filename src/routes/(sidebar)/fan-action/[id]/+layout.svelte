<script lang="ts">
	import { page } from '$app/state';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import InfoDrawer from '$lib/components/custom/info-drawer.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { data } from '../temp/data.js';
	import { fanActionEditTabHref } from '../edit-tabs.js';
	import ChartColumn from '@lucide/svelte/icons/chart-column';
	import * as m from '$lib/paraglide/messages.js';

	let { children } = $props();

	const actionId = $derived(Number(page.params.id));
	const action = $derived(data.find((item) => item.id === actionId));

	const isSettingsTab = $derived(page.url.pathname.endsWith('/settings'));

	const processedPercent = 81;

	function handleSave() {
		console.log('save fan action', actionId);
	}
</script>

<PageHeader
	breadcrumbs={[
		{ title: m.crumb_home(), url: '/' },
		{ title: m.sidebar_module_fans() },
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
		<div class="flex w-36 flex-col gap-1">
			<span class="text-xs font-medium text-primary">
				{m.fan_action_processed_progress({ percent: processedPercent })}
			</span>
			<div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
				<div class="h-full rounded-full bg-primary" style:width="{processedPercent}%"></div>
			</div>
		</div>
		<Button size="sm" onclick={handleSave}>{m.save()}</Button>
	{/if}
</PageHeader>

{#if !action}
	<p class="text-muted-foreground">{m.fan_action_not_found()}</p>
{:else}
	<div class={cn('flex flex-col', isSettingsTab && 'min-h-0 flex-1 overflow-hidden')}>
		<div class={cn(isSettingsTab ? 'min-h-0 flex-1' : 'px-4 pt-4 pb-8')}>
			{@render children()}
		</div>
	</div>
{/if}

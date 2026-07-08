<script lang="ts">
	import { page } from '$app/state';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import InfoDrawer from '$lib/components/custom/info-drawer.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { data } from '../temp/data.js';
	import { fanActionEditTabHref } from '../edit-tabs.js';
	import ChartColumn from '@lucide/svelte/icons/chart-column';
	import Pause from '@lucide/svelte/icons/pause';
	import Play from '@lucide/svelte/icons/play';
	import { setWorkflowRunning } from '../components/workflow/editing-context.js';
	import * as m from '$lib/paraglide/messages.js';

	let { children } = $props();

	let isRunning = $state(false);

	setWorkflowRunning(() => isRunning);

	const actionId = $derived(Number(page.params.id));
	const action = $derived(data.find((item) => item.id === actionId));

	const isSettingsTab = $derived(page.url.pathname.endsWith('/settings'));

	const processedPercent = 81;
	const progressRadius = 8;
	const progressCircumference = 2 * Math.PI * progressRadius;
	const progressOffset = $derived(progressCircumference * (1 - processedPercent / 100));

	function handleSave() {
		console.log('save fan action', actionId);
	}

	function toggleRunning() {
		isRunning = !isRunning;
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
		<Button
			variant="outline"
			size="sm"
			type="button"
			onclick={toggleRunning}
			aria-label={isRunning ? m.fan_action_pause() : m.fan_action_play()}
		>
			{#if isRunning}
				<Pause />
			{:else}
				<Play />
			{/if}
			{isRunning ? m.fan_action_pause() : m.fan_action_play()}
		</Button>
		<InfoDrawer title={m.fan_action_edit_title()}>
			<p class="text-sm text-muted-foreground">{m.fan_action_info_description()}</p>
		</InfoDrawer>
		<Button variant="outline" size="sm" href={fanActionEditTabHref(actionId, 'stats')}>
			<ChartColumn />
			{m.nav_analytics()}
		</Button>
		<Button
			variant="outline"
			size="sm"
			type="button"
			class="gap-1.5"
			aria-label={m.fan_action_processed_progress({ percent: processedPercent })}
		>
			<span class="relative flex size-5 shrink-0 items-center justify-center" aria-hidden="true">
				<svg class="absolute inset-0 size-full -rotate-90" viewBox="0 0 20 20">
					<circle
						cx="10"
						cy="10"
						r={progressRadius}
						fill="none"
						class="stroke-primary/20"
						stroke-width="2"
					/>
					<circle
						cx="10"
						cy="10"
						r={progressRadius}
						fill="none"
						class="stroke-primary"
						stroke-width="2"
						stroke-linecap="round"
						stroke-dasharray={progressCircumference}
						stroke-dashoffset={progressOffset}
					/>
				</svg>
				<span class="text-[0.5625rem] leading-none font-semibold text-primary">
					{processedPercent}
				</span>
			</span>
			%
		</Button>
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

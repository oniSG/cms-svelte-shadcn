<script lang="ts">
	import { page } from '$app/state';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { cn } from '$lib/utils.js';
	import { data } from '../data.js';
	import {
		FAN_ACTION_EDIT_TABS,
		fanActionEditTabHref,
		isFanActionEditTab,
		type FanActionEditTab
	} from '../edit-tabs.js';
	import * as m from '$lib/paraglide/messages.js';

	let { children } = $props();

	const actionId = $derived(Number(page.params.id));
	const action = $derived(data.find((item) => item.id === actionId));

	const activeTab = $derived.by(() => {
		const segment = page.url.pathname.split('/').at(-1) ?? '';
		return isFanActionEditTab(segment) ? segment : 'basic';
	});

	const tabLabels: Record<FanActionEditTab, () => string> = {
		basic: () => m.fan_action_tab_basic(),
		settings: () => m.fan_action_tab_settings(),
		email: () => m.fan_action_tab_email_stats(),
		sms: () => m.fan_action_tab_sms_stats(),
		push: () => m.fan_action_tab_push_stats(),
		popup: () => m.fan_action_tab_popup_stats(),
		'notification-bar': () => m.fan_action_tab_notification_bar_stats()
	};

	const tabTriggerClass =
		'gap-2 rounded-full border border-transparent! px-3 py-1 text-sm font-medium text-foreground/60 hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring after:absolute after:inset-x-0 after:bottom-[-5px] after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity data-[active]:text-foreground data-[active]:after:opacity-100';
</script>

<PageHeader
	breadcrumbs={[
		{ title: 'Home', url: '/' },
		{ title: 'Fans' },
		{ title: m.nav_fans_campaigns(), url: '/fan-action' },
		...(action ? [{ title: action.event }] : []),
		{ title: m.fan_action_edit_title() }
	]}
/>

{#if !action}
	<p class="text-muted-foreground">{m.fan_action_not_found()}</p>
{:else}
	<div class="space-y-6 pb-8">
		<Tabs.Root value={activeTab} class="gap-6">
			<div class="overflow-x-auto border-b">
				<Tabs.List
					variant="line"
					class="h-auto w-max min-w-full justify-start rounded-none bg-transparent"
				>
					{#each FAN_ACTION_EDIT_TABS as tab (tab)}
						<a
							href={fanActionEditTabHref(actionId, tab)}
							data-active={activeTab === tab ? true : undefined}
							aria-current={activeTab === tab ? 'page' : undefined}
							class={cn(tabTriggerClass)}
						>
							{tabLabels[tab]()}
						</a>
					{/each}
				</Tabs.List>
			</div>

			<div class="pt-2">
				{@render children()}
			</div>
		</Tabs.Root>
	</div>
{/if}

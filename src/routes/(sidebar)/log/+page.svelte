<!--
  +page.svelte — the logs page.

  Glue layer between three independent concerns:

    1. URL state   (`createLogsParams`) — source of truth for snapshot,
                                          page, filters, sort, limit.
                                          Lives in `?...` query params.

    2. Data fetch  (`createLogsQuery`)  — turns the current URL state
                                          into a TanStack Query that
                                          calls the fake backend.

    3. UI          (`<DataTable />`)    — fully controlled. Renders
                                          what it's given and reports
                                          interactions via callbacks.

  Snapshot model: see api.ts and url-state.svelte.ts headers. In short:
  `asOf` is captured on first visit, frozen until the user hits Refresh.
  All filter / sort / page changes operate within that frozen snapshot.
-->
<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { columns } from './columns.js';
	import DataTable from './components/data-table.svelte';
	import {
		clampPage,
		createLogsParams,
		ensureAsOf,
		goNext,
		goPrev,
		goToPage,
		patchAndResetPage,
		refreshSnapshot,
		resetAll,
		toLogsQuery
	} from './url-state.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { createLogsQuery } from './temp/query.js';

	const params = createLogsParams();

	// Fallback used by toLogsQuery in the narrow window between mount and
	// the $effect below that writes `as_of` to the URL. Captured ONCE
	// at component setup so it's stable across renders.
	const fallbackAsOf = new Date();

	const breadcrumbs = $derived([
		{ title: m.log_breadcrumb_home(), url: '/' as const },
		{ title: m.log_breadcrumb_settings() },
		{ title: m.log_breadcrumb_logs() }
	]);

	const currentQuery = $derived(toLogsQuery($params, fallbackAsOf));
	const logs = createLogsQuery(() => currentQuery);

	// On first visit `as_of` isn't in the URL yet — write it so the
	// snapshot persists across refreshes and is included in shared links.
	$effect(() => {
		ensureAsOf(params, $params);
	});

	// If the user narrows filters to the point where their current page no
	// longer exists, snap back to the last valid page. Runs after each
	// response. Guarded by `loading` so we don't fight a fetch in flight.
	$effect(() => {
		if (!logs.isFetching && logs.data) {
			clampPage(params, currentQuery.page, logs.data.totalPages);
		}
	});
</script>

<PageHeader {breadcrumbs} />

<DataTable
	{columns}
	query={currentQuery}
	data={logs.data?.items ?? []}
	total={logs.data?.total ?? 0}
	totalPages={logs.data?.totalPages ?? 1}
	loading={logs.isFetching}
	onPatch={(patch) => patchAndResetPage(params, patch)}
	onGotoPage={(page) => goToPage(params, page)}
	onNext={() => goNext(params, logs.data?.totalPages ?? 1)}
	onPrev={() => goPrev(params)}
	onRefresh={() => refreshSnapshot(params)}
	onReset={() => resetAll(params)}
/>

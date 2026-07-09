<script lang="ts">
	import type { DateRange } from 'bits-ui';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import DateRangePicker from './compoents/date-range-picker.svelte';
	import DeliveryChart from './compoents/delivery-chart.svelte';
	import InfoDrawer from '$lib/components/custom/info-drawer.svelte';
	import KpiCards from './compoents/kpi-cards.svelte';
	import LinksTable from './compoents/links-table.svelte';
	import MetricsTable from './compoents/metrics-table.svelte';
	import SankeyChart from './compoents/sankey-chart.svelte';
	import SuccessChart from './compoents/success-chart.svelte';

	let dateRange = $state<DateRange | undefined>(undefined);
</script>

<PageHeader breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Fans' }, { title: 'Events' }]}>
	<DateRangePicker bind:value={dateRange} />
	<InfoDrawer title="Campaign Statistics">
		<div class="space-y-4 text-sm">
			<p class="text-muted-foreground">
				This page shows delivery and engagement metrics for your email campaigns.
			</p>
			<div class="space-y-2">
				<h3 class="font-semibold">KPI Cards</h3>
				<p class="text-muted-foreground">
					Top-level delivery, open rate, click rate, and conversion metrics for the selected period.
				</p>
			</div>
			<div class="space-y-2">
				<h3 class="font-semibold">Detailed Metrics</h3>
				<p class="text-muted-foreground">
					Breakdown of sent, delivered, opened, clicked, unsubscribed, bounced, and spam counts with
					percentages relative to sent and delivered.
				</p>
			</div>
			<div class="space-y-2">
				<h3 class="font-semibold">Evaluation Flow</h3>
				<p class="text-muted-foreground">
					Sankey diagram showing how emails flow from sent through delivery, opens, clicks, and
					onwards.
				</p>
			</div>
			<div class="space-y-2">
				<h3 class="font-semibold">Links</h3>
				<p class="text-muted-foreground">
					Click performance per tracked link — unique clicks, uniqueness ratio, and total clicks.
				</p>
			</div>
		</div>
	</InfoDrawer>
</PageHeader>

<div class="space-y-4 pb-4">
	<KpiCards />
	<MetricsTable />
	<LinksTable />
	<SuccessChart />
	<DeliveryChart />
	<SankeyChart />
</div>

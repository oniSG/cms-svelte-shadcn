<script lang="ts">
	import { BarChart, Highlight } from 'layerchart';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import ChartContainer from '$lib/components/ui/chart/chart-container.svelte';
	import type { ChartConfig } from '$lib/components/ui/chart/chart-utils.js';
	import * as Card from '$lib/components/ui/card';
	import { scaleBand } from 'd3-scale';
	import { cubicInOut } from 'svelte/easing';
	import { deliveryOverTime } from '../data';

	const chartData = deliveryOverTime.map((d) => ({
		...d,
		label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
	}));

	const chartConfig = {
		delivered: { label: 'Delivered', color: 'var(--chart-1)' },
		softBounce: { label: 'Soft Bounce', color: 'var(--chart-2)' },
		hardBounce: { label: 'Hard Bounce', color: 'var(--chart-3)' },
		notDelivered: { label: 'Not Delivered', color: 'var(--chart-4)' },
		spam: { label: 'Spam', color: 'var(--chart-5)' }
	} satisfies ChartConfig;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Delivery Over Time</Card.Title>
		<Card.Description>Breakdown by delivery status per day</Card.Description>
	</Card.Header>
	<Card.Content>
		<ChartContainer config={chartConfig} class="h-64 w-full">
			<BarChart
				data={chartData}
				x="label"
				xScale={scaleBand().padding(0.25)}
				axis="x"
				rule={false}
				legend
				seriesLayout="stack"
				series={[
					{
						key: 'delivered',
						label: chartConfig.delivered.label,
						color: chartConfig.delivered.color,
						props: { rounded: 'bottom' }
					},
					{
						key: 'softBounce',
						label: chartConfig.softBounce.label,
						color: chartConfig.softBounce.color
					},
					{
						key: 'hardBounce',
						label: chartConfig.hardBounce.label,
						color: chartConfig.hardBounce.color
					},
					{
						key: 'notDelivered',
						label: chartConfig.notDelivered.label,
						color: chartConfig.notDelivered.color
					},
					{
						key: 'spam',
						label: chartConfig.spam.label,
						color: chartConfig.spam.color
					}
				]}
				props={{
					bars: {
						stroke: 'none',
						motion: { type: 'tween', duration: 500, easing: cubicInOut }
					},
					highlight: { area: false }
				}}
			>
				{#snippet belowMarks()}
					<Highlight area={{ class: 'fill-muted' }} />
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip />
				{/snippet}
			</BarChart>
		</ChartContainer>
	</Card.Content>
</Card.Root>

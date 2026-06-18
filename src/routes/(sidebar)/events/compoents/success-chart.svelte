<script lang="ts">
	import { LineChart } from 'layerchart';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import ChartContainer from '$lib/components/ui/chart/chart-container.svelte';
	import type { ChartConfig } from '$lib/components/ui/chart/chart-utils.js';
	import * as Card from '$lib/components/ui/card';
	import { scaleUtc } from 'd3-scale';
	import { curveMonotoneX } from 'd3-shape';
	import { successOverTime } from '../data';

	const chartData = successOverTime.map((d) => ({ ...d, date: new Date(d.date) }));

	const chartConfig = {
		delivered: { label: 'Delivered', color: 'var(--chart-1)' },
		opened: { label: 'Opened', color: 'var(--chart-2)' },
		clicked: { label: 'Clicked', color: 'var(--chart-3)' }
	} satisfies ChartConfig;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Success Over Time</Card.Title>
		<Card.Description>Delivered, opened, and clicked per day</Card.Description>
	</Card.Header>
	<Card.Content>
		<ChartContainer config={chartConfig} class="h-64 w-full">
			<LineChart
				data={chartData}
				x="date"
				xScale={scaleUtc()}
				axis="x"
				legend
				series={[
					{
						key: 'delivered',
						label: chartConfig.delivered.label,
						color: chartConfig.delivered.color
					},
					{ key: 'opened', label: chartConfig.opened.label, color: chartConfig.opened.color },
					{ key: 'clicked', label: chartConfig.clicked.label, color: chartConfig.clicked.color }
				]}
				props={{
					spline: { curve: curveMonotoneX, motion: 'tween', strokeWidth: 2 },
					xAxis: {
						ticks: chartData.map((d) => d.date),
						format: (v: Date) => v.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
					}
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</LineChart>
		</ChartContainer>
	</Card.Content>
</Card.Root>

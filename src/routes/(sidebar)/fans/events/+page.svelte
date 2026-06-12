<script lang="ts">
	import { AreaChart } from 'layerchart';
	import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
	import * as Card from '$lib/components/ui/card/index.js';
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { scaleTime, scaleBand } from 'd3-scale';
	import { BarChart } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	import { curveNatural } from "d3-shape";



	const barData = [
		{ date: new Date(2026, 4, 19), doruceno: 2930, nedoruceno: 12, hardBounce: 3,  softBounce: 15, spam: 2 },
		{ date: new Date(2026, 4, 20), doruceno: 14,   nedoruceno: 2,  hardBounce: 1,  softBounce: 1,  spam: 0 },
		{ date: new Date(2026, 4, 21), doruceno: 14,   nedoruceno: 1,  hardBounce: 0,  softBounce: 2,  spam: 1 },
		{ date: new Date(2026, 4, 22), doruceno: 13,   nedoruceno: 3,  hardBounce: 1,  softBounce: 0,  spam: 0 },
	];

	const chartData = [
		{ date: new Date(2026, 4, 15), doruceno: 1200, otevreno: 310, kliknuto: 45 },
		{ date: new Date(2026, 4, 16), doruceno: 850, otevreno: 210, kliknuto: 18 },
		{ date: new Date(2026, 4, 17), doruceno: 150, otevreno: 30, kliknuto: 2 },
		{ date: new Date(2026, 4, 18), doruceno: 90, otevreno: 12, kliknuto: 0 },
		{ date: new Date(2026, 4, 19), doruceno: 2911, otevreno: 706, kliknuto: 24 },
		{ date: new Date(2026, 4, 20), doruceno: 98, otevreno: 15, kliknuto: 1 },
		{ date: new Date(2026, 4, 21), doruceno: 5, otevreno: 1, kliknuto: 0 },
		{ date: new Date(2026, 4, 22), doruceno: 1450, otevreno: 420, kliknuto: 68 },
		{ date: new Date(2026, 4, 23), doruceno: 1100, otevreno: 290, kliknuto: 35 },
		{ date: new Date(2026, 4, 24), doruceno: 450, otevreno: 95, kliknuto: 12 },
		{ date: new Date(2026, 4, 25), doruceno: 120, otevreno: 22, kliknuto: 2 },
		{ date: new Date(2026, 4, 26), doruceno: 0, otevreno: 0, kliknuto: 0 },
		{ date: new Date(2026, 4, 27), doruceno: 1850, otevreno: 510, kliknuto: 89 },
		{ date: new Date(2026, 4, 28), doruceno: 920, otevreno: 198, kliknuto: 21 }
	];

	const metrics = [
		{ metric: 'Odesláno', count: '2930', sent: '100%', delivered: '-', rating: 'Základ' },
		{ metric: 'Doručeno', count: '2912', sent: '99.39%', delivered: '-', rating: 'Výborné' },
		{ metric: 'Otevřeno', count: '900', sent: '30.72%', delivered: '30.91%', rating: 'V normě' },
		{ metric: 'Prokliky (CTR)', count: '29', sent: '0.99%', delivered: '1%', rating: 'Nízké' },
		{ metric: 'Konverze', count: '0', sent: '0%', delivered: '0%', rating: 'Sledovat' },
		{ metric: 'Odhlášeno', count: '1', sent: '0.03%', delivered: '0.03%', rating: 'Výborné' },
		{ metric: 'Hard bounce', count: '3', sent: '0.1%', delivered: '-', rating: 'Výborné' },
		{ metric: 'Soft bounce', count: '15', sent: '0.51%', delivered: '-', rating: 'Výborné' },
		{ metric: 'Spam', count: '0', sent: '0%', delivered: '0%', rating: 'Výborné' }
	];

	const sankeyData = {
		nodes: [
			{ name: 'Odesláno' },
			{ name: 'Doručeno' },
			{ name: 'Soft Bounce' },
			{ name: 'Otevřeno' },
			{ name: 'Kliknuto' },
			{ name: 'Ostatní odkazy' }
		],

		links: [
			{ source: 0, target: 1, value: 2912 },
			{ source: 0, target: 2, value: 3 },
			{ source: 1, target: 3, value: 900 },
			{ source: 3, target: 4, value: 29 },
			{ source: 4, target: 5, value: 29 }
		]
	};

	const width = 1200;
	const height = 450;

	const sankeyGenerator = sankey()
		.nodeWidth(18)
		.nodePadding(30)
		.extent([[10, 10], [width - 10, height - 10]]);

	const graph = sankeyGenerator({
		nodes: sankeyData.nodes.map(d => ({ ...d })),
		links: sankeyData.links.map(d => ({ ...d }))
	}) as { nodes: (any)[], links: (any)[] };

</script>

<PageHeader
	breadcrumbs={[
		{ title: 'Home', url: '/' },
		{ title: 'Fans' },
		{ title: 'Events' }
	]}
/>

<div class="mt-6 space-y-6">

	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Description>Doručeno</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-3xl font-semibold">2912</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Description>Míra otevření</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-3xl font-semibold">30,91%</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Description>Míra prokliků</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-3xl font-semibold">1%</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Description>Konverze</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-3xl font-semibold">0%</p>
			</Card.Content>
		</Card.Root>
	</div>

	<Card.Root>
		<Card.Header class="pb-2">
			<Card.Title class="text-sm font-semibold">Detailní přehled metrik</Card.Title>
		</Card.Header>
		<Card.Content class="flex items-center justify-between">
			<Table.Root>
				<Table.Header class="bg-transparent">
					<Table.Row>
						<Table.Head>Metrika</Table.Head>
						<Table.Head>Počet</Table.Head>
						<Table.Head>% z odeslaných</Table.Head>
						<Table.Head>% z doručených</Table.Head>
						<Table.Head>Hodnocení</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each metrics as metric(metric)}
						<Table.Row>
							<Table.Cell>{metric.metric}</Table.Cell>
							<Table.Cell>{metric.count}</Table.Cell>
							<Table.Cell>{metric.sent}</Table.Cell>
							<Table.Cell>{metric.delivered}</Table.Cell>
							<Table.Cell>{metric.rating}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
	<Card.Root class="w-full overflow-hidden">

		<Card.Header class="pb-4">

			<Card.Title class="text-sm font-semibold">
				Úspěšnost
			</Card.Title>

			<div class="flex items-center gap-4 text-xs mt-2">
				<div class="flex items-center gap-1.5">
					<div class="size-2 rounded-full" style="background-color:var(--primary)"></div>
					<span>Doručeno</span>
				</div>

				<div class="flex items-center gap-1.5">
					<div class="size-2 rounded-full" style="background-color:var(--chart-6)"></div>
					<span>Otevřeno</span>
				</div>

				<div class="flex items-center gap-1.5">
					<div class="size-2 rounded-full" style="background-color:var(--chart-7)"></div>
					<span>Kliknuto</span>
				</div>
			</div>
		</Card.Header>

		<Card.Content>

			<div class="h-96 w-full pb-6">

				<AreaChart
					data={chartData}
					x="date"
					xScale={scaleTime()}
					yPadding={[10, 10]}
					series={[
        { key: "doruceno", label: "Doručeno", color: "var(--primary)" },
        { key: "otevreno", label: "Otevřeno", color: "var(--chart-6)" },
        { key: "kliknuto", label: "Kliknuto", color: "var(--chart-7)" }
    ]}
					tooltip={true}
					props={{
        area: {
            curve: curveNatural, // <-- PŘIDÁNO ZDE
            fillOpacity: 0.12,
            motion: "tween"
        },
        line: {
            curve: curveNatural, // <-- PŘIDÁNO ZDE
            class: "fill-none stroke-2",
            motion: "tween"
        },
        xAxis: {
            format: (v: Date) => `${v.getDate()}/${v.getMonth()+1}`,
            class: "text-[11px] fill-muted-foreground"
        },
        yAxis: {
            class: "text-[11px] fill-muted-foreground",
            grid: {
                class: "stroke-muted/30"
            }
        }
    }}


				/>


			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="overflow-hidden">

		<Card.Header>
			<Card.Title class="text-sm font-semibold">
				Vyhodnocení
			</Card.Title>
		</Card.Header>

		<Card.Content>

			<svg
				class="w-full"
				preserveAspectRatio="xMidYMid meet"
				style="display: block; height: auto;"
				viewBox={`0 0 ${width} ${height}`}
			>

				{#each graph.links as link(link)}

					<path
						d={sankeyLinkHorizontal()(link)}
						fill="none"
						stroke="#c4b5fd"
						stroke-opacity="0.35"
						stroke-width={Math.max(1, link.width)}
					/>

				{/each}

				{#each graph.nodes as node(node)}

					<rect
						x={node.x0}
						y={node.y0}
						width={(node.x1 ?? 0) - (node.x0 ?? 0)}
						height={(node.y1 ?? 0) - (node.y0 ?? 0)}
						fill={
							node.name === "Odesláno" ? "#84cc16" :
							node.name === "Doručeno" ? "#6366f1" :
							node.name === "Otevřeno" ? "#f87171" :
							node.name === "Kliknuto" ? "#a855f7" :
							node.name === "Ostatní odkazy" ? "#3b82f6" :
							"#22d3ee"
						}
						rx="4"
					/>

					<text
						x={node.x1 + 6}
						y={(node.y0 + node.y1) / 2}
						class="fill-muted-foreground text-xs"
						dominant-baseline="middle"
					>
						{node.name}
					</text>

				{/each}
			</svg>
		</Card.Content>
	</Card.Root>

</div>

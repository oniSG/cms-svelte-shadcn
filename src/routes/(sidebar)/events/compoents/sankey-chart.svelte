<script lang="ts">
	import { Chart, Svg, Sankey } from 'layerchart';
	import * as Card from '$lib/components/ui/card';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { sankey as sankeyData } from '../data';

	const graphData = $derived(structuredClone(sankeyData));

	// Hardcoded to match the Chart padding prop below — used to map SVG coords → HTML div coords
	const PAD = { top: 10, left: 90 };

	const nodeColors = [
		'var(--chart-1)',
		'var(--chart-2)',
		'var(--chart-3)',
		'var(--chart-4)',
		'var(--chart-5)'
	];

	const DEPTH_SHIFTS = [0, 0, 40, 55, 55];
	function shift(node: any): number {
		return DEPTH_SHIFTS[Math.min(node.depth ?? 0, DEPTH_SHIFTS.length - 1)];
	}

	function ribbonPath(link: any): string {
		const x0 = link.source.x1 as number;
		const x1 = link.target.x0 as number;
		const xi = (x0 + x1) / 2;
		const halfW = Math.max(0.5, ((link.width ?? 1) as number) / 2);
		const y0 = (link.y0 as number) + shift(link.source);
		const y1 = (link.y1 as number) + shift(link.target);
		return [
			`M${x0},${y0 - halfW}`,
			`C${xi},${y0 - halfW} ${xi},${y1 - halfW} ${x1},${y1 - halfW}`,
			`L${x1},${y1 + halfW}`,
			`C${xi},${y1 + halfW} ${xi},${y0 + halfW} ${x0},${y0 + halfW}`,
			'Z'
		].join(' ');
	}

	// Lifted out of the Sankey snippet so the HTML tooltip overlay can access them
	let layoutNodes = $state<any[]>([]);
	function handleUpdate(data: any) {
		layoutNodes = data.nodes;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Evaluation Flow</Card.Title>
		<Card.Description>Email delivery and engagement funnel</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="h-80 w-full">
			<Chart
				data={graphData}
				padding={{ top: PAD.top, bottom: 10, left: PAD.left, right: 100 }}
			>
				{#snippet children(_)}
					<!-- SVG layer: ribbons, nodes, labels -->
					<Svg>
						<Sankey
							nodeId={(d) => d.id}
							nodeAlign="left"
							nodeWidth={12}
							nodePadding={16}
							onUpdate={handleUpdate}
						>
							{#snippet children({ nodes, links })}
								{@const maxX0 = Math.max(...nodes.map((n) => n.x0 ?? 0))}
								{#each links as link (link.index)}
									<path
										d={ribbonPath(link)}
										fill={nodeColors[(link.source.index ?? 0) % nodeColors.length]}
										fill-opacity="0.25"
										stroke="none"
									/>
								{/each}
								{#each nodes as node, i (node.index)}
									{@const dy = shift(node)}
									{@const nodeH = Math.max(2, (node.y1 ?? 0) - (node.y0 ?? 0))}
									{@const isSmall = nodeH < 12}
									{@const isRight = (node.x0 ?? 0) >= maxX0 - 1}
									<rect
										x={node.x0 ?? 0}
										y={(node.y0 ?? 0) + dy}
										width={(node.x1 ?? 0) - (node.x0 ?? 0)}
										height={nodeH}
										fill={nodeColors[i % nodeColors.length]}
										rx={2}
									/>
									{#if isSmall}
										<!-- small node: label floats above -->
										<text
											x={((node.x0 ?? 0) + (node.x1 ?? 0)) / 2}
											y={(node.y0 ?? 0) + dy - 7}
											text-anchor="middle"
											font-size="10"
											fill="currentColor"
											opacity="0.7"
										>
											{node.label}
											<tspan opacity="0.5"> · {node.value?.toLocaleString()}</tspan>
										</text>
									{:else}
										<!-- large node: label to the side -->
										<text
											x={isRight ? (node.x0 ?? 0) - 8 : (node.x1 ?? 0) + 8}
											y={((node.y0 ?? 0) + (node.y1 ?? 0)) / 2 + dy}
											dy="0.35em"
											text-anchor={isRight ? 'end' : 'start'}
											font-size="11"
											fill="currentColor"
											opacity="0.75"
										>
											{node.label}
											<tspan opacity="0.5"> · {node.value?.toLocaleString()}</tspan>
										</text>
									{/if}
								{/each}
							{/snippet}
						</Sankey>
					</Svg>

					<!-- HTML overlay: transparent divs matching each node rect, for tooltip triggers.
					     Rendered after SVG so they sit on top in DOM order and capture pointer events. -->
					<Tooltip.Provider>
						{#each layoutNodes as node (node.index)}
							{@const dy = shift(node)}
							{@const nodeH = Math.max(8, (node.y1 ?? 0) - (node.y0 ?? 0))}
							<Tooltip.Root delayDuration={100}>
								<Tooltip.Trigger
									class="absolute cursor-default border-0 bg-transparent p-0 outline-none"
									style="left:{PAD.left + (node.x0 ?? 0)}px; top:{PAD.top + (node.y0 ?? 0) + dy}px; width:{(node.x1 ?? 0) - (node.x0 ?? 0)}px; height:{nodeH}px"
								/>
								<Tooltip.Content>
									<p class="font-medium">{node.label}</p>
									<p class="text-muted-foreground">{node.value?.toLocaleString()}</p>
								</Tooltip.Content>
							</Tooltip.Root>
						{/each}
					</Tooltip.Provider>
				{/snippet}
			</Chart>
		</div>
	</Card.Content>
</Card.Root>

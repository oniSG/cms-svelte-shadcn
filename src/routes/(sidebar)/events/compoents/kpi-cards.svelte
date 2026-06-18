<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { kpiCards } from '../data';
</script>

<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
	{#each kpiCards as card (card.label)}
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>{card.label}</Card.Description>
			</Card.Header>
			<Card.Content>
				<p class="text-3xl font-semibold">{card.value}</p>
				<p class="mt-1 text-xs text-muted-foreground">in selected period</p>
			</Card.Content>
		</Card.Root>
	{/each}
</div>

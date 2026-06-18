<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { metricsTable } from '../data';
</script>

<Card.Root size="sm">
	<Card.Header>
		<Card.Title>Detailed Metrics</Card.Title>
	</Card.Header>
	<Card.Content class="group-data-[size=sm]/card:px-0">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="pl-4">Metric</Table.Head>
					<Table.Head class="text-right">Count</Table.Head>
					<Table.Head class="text-right">% of Sent</Table.Head>
					<Table.Head class="text-right">% of Delivered</Table.Head>
					<Table.Head class="pr-4 text-right">Rating</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each metricsTable as row (row.metric)}
					<Table.Row>
						<Table.Cell class="pl-4 font-medium">{row.metric}</Table.Cell>
						<Table.Cell class="text-right">{row.count.toLocaleString()}</Table.Cell>
						<Table.Cell class="text-right">
							{row.pctOfSent != null ? (row.pctOfSent * 100).toFixed(2) + '%' : '—'}
						</Table.Cell>
						<Table.Cell class="text-right">
							{row.pctOfDelivered != null ? (row.pctOfDelivered * 100).toFixed(2) + '%' : '—'}
						</Table.Cell>
						<Table.Cell class="pr-4 text-right">{row.ratingLabel}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>

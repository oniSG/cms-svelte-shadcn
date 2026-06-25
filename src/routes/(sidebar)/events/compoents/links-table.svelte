<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import { linksTable } from '../data';

	function copy(text: string) {
		navigator.clipboard.writeText(text);
	}

	function isUrl(value: string) {
		return value.startsWith('http');
	}

	function openInTab(url: string) {
		window.open(url, '_blank', 'noopener,noreferrer');
	}
</script>

<Card.Root size="sm">
	<Card.Header>
		<Card.Title>Links</Card.Title>
	</Card.Header>
	<Card.Content class="group-data-[size=sm]/card:px-0">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-10 pl-4">#</Table.Head>
					<Table.Head>Link</Table.Head>
					<Table.Head class="text-right">Unique Clicks</Table.Head>
					<Table.Head class="text-right">Uniqueness</Table.Head>
					<Table.Head class="pr-4 text-right">Total</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each linksTable as row (row.rank)}
					<Table.Row>
						<Table.Cell class="pl-4 text-muted-foreground">{row.rank}</Table.Cell>
						<Table.Cell>
							<div class="flex items-center gap-1">
								<span class="max-w-xs truncate text-sm" title={row.link}>{row.link}</span>
								<Button
									variant="ghost"
									size="icon"
									class="size-7 shrink-0"
									onclick={() => copy(row.link)}
								>
									<CopyIcon class="size-3.5" />
								</Button>
								{#if isUrl(row.link)}
									<Button
										variant="ghost"
										size="icon"
										class="size-7 shrink-0"
										onclick={() => openInTab(row.link)}
									>
										<ExternalLinkIcon class="size-3.5" />
									</Button>
								{/if}
							</div>
						</Table.Cell>
						<Table.Cell class="text-right">{row.uniqueClicks}</Table.Cell>
						<Table.Cell class="text-right">{(row.uniqueness * 100).toFixed(1)}%</Table.Cell>
						<Table.Cell class="pr-4 text-right">{row.total}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>

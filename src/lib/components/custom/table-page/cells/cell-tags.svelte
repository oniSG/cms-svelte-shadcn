<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import { tagColorClass } from './tag-color';

	let { value }: { value: unknown } = $props();

	const tags = $derived<string[]>(Array.isArray(value) ? value.map(String) : []);
</script>

{#if tags.length === 0}
	<MinusIcon class="size-4 text-muted-foreground/50" />
{:else}
	<div class="flex flex-wrap gap-2">
		{#each tags as tag (tag)}
			<Badge variant="outline" class="font-medium {tagColorClass(tag)}">{tag}</Badge>
		{/each}
	</div>
{/if}

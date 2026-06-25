<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';

	// Změníme typ na unknown, abychom bezpečně ošetřili jakýkoliv vstup
	let { value }: { value: unknown } = $props();

	// Neprůstřelné rozsekání/převod na pole štítků
	let tags = $derived(
		Array.isArray(value)
			? value.map((t) => String(t).trim()).filter(Boolean) // Pokud už to JE pole
			: typeof value === 'string'
				? value
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean) // Pokud je to text s čárkami
				: value
					? [String(value)]
					: [] // Pokud je to jedno číslo/boolean, hodíme ho do pole, jinak prázdno
	);
</script>

<div class="flex flex-wrap gap-1">
	{#each tags as tag (tag)}
		<Badge variant="secondary">{tag}</Badge>
	{/each}
</div>

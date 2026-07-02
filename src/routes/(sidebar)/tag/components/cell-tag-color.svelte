<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { colorClasses, type Tag } from '../tag';

	let { row }: { row: Tag } = $props();
</script>

<Badge variant="outline" class="font-medium uppercase {colorClasses[row.color]}">
	{row.name}
</Badge>

<script lang="ts">
	import type { ActionType } from '../columns';
	import { getTypeLabel } from '../columns';

	let { value }: { value: ActionType } = $props();
</script>

<span>{getTypeLabel(value)}</span>

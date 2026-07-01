<script lang="ts">
	import type { Align } from '../types';

	let { value, align = 'left' }: { value: unknown; align?: Align } = $props();
</script>

<span class:text-right={align === 'right'} class:text-center={align === 'center'}>
	{value == null ? '' : String(value)}
</span>

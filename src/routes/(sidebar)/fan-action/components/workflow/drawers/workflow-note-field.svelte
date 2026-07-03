<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { drawerLabelClass } from './drawer-styles';

	let {
		id,
		value = $bindable('')
	}: {
		id: string;
		value?: string;
	} = $props();
</script>

<div class="space-y-2">
	<Label class={drawerLabelClass} for={id}>{m.fan_action_flow_note_label()}</Label>
	<Input bind:value {id} placeholder={m.fan_action_flow_note_placeholder()} />
</div>

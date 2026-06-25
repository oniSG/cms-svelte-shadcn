<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	import * as m from '$lib/paraglide/messages.js';
</script>

<PageHeader
	breadcrumbs={[
		{ title: 'Home', url: '/' },
		{ title: m.sidebar_module_settings() },
		{ title: m.nav_set_security() }
	]}
/>

<Card.Root class="w-full max-w-xl">
	<Card.Header>
		<Card.Title>{m.security_title()}</Card.Title>
		<Card.Description>{m.security_description()}</Card.Description>
	</Card.Header>
	<Card.Content class="flex justify-between gap-6">
		<Label class="text-sm">{m.security_2fa()}</Label>
		<Switch />
	</Card.Content>
</Card.Root>

<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<PageHeader
	breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Settings' }, { title: 'Security' }]}
/>
<Card.Root class="w-full max-w-xl">
	<Card.Header>
		<Card.Title>Zabezpečení</Card.Title>
		<Card.Description>Nastavení zabezpečení se projeví u všech uživatelů</Card.Description>
	</Card.Header>
	<Card.Content class="flex justify-between gap-6">
		<Label class="text-sm">Povinné dvoufaktorové ověření</Label>
		<Switch />
	</Card.Content>
</Card.Root>

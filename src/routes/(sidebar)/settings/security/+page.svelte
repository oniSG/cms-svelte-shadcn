<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
</script>

<PageHeader breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Settings' }, { title: 'Security' }]} />

<Card.Root>
	<Card.Header>
		<Card.Title>Zabezpečení</Card.Title>
		<Card.Description>Nastavení zabezpečení se projeví u všech uživatelů</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex items-center gap-3">
			<Switch id="enable-mfa" class="focus-visible:ring-0 focus-visible:ring-offset-0" />
			<Label for="enable-mfa" class="font-light cursor-pointer">Povinné dvoufaktorové ověření</Label>
		</div>
	</Card.Content>
	<Card.Footer>
		<Button>ULOŽIT</Button>
	</Card.Footer>
</Card.Root>





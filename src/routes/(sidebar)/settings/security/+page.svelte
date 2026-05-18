<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<PageHeader breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Settings' }, { title: 'Security' }]} />

<div class="border border-gray-200 rounded-lg border shadow-xs">
	<h3 class="font-medium ml-6 mb-2 mt-6 text-lg">Zabezpečení</h3>
	<p class="text-gray-400 ml-6 text-sm">Nastavení zabezpečení se projeví u všech uživatelů</p>

	<div class="flex items-center gap-3 ml-6 mt-6">
		<Switch id="enable-mfa" class="data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 focus-visible:ring-0 focus-visible:ring-offset-0"
		/>		<Label for="enable-mfa" class="font-light cursor-pointer">Povinné dvoufaktorové ověření</Label>
	</div>


	<div class="flex  justify-start mt-6">
		<Button class="bg-lime-500 ml-6 mt-2 mb-4 text-white" variant="outline">ULOŽIT</Button>
	</div>
</div>




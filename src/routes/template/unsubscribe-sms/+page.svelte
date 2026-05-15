<script lang="ts">
	import LanguageSwitch from '$lib/components/custom/language-select.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Switch } from '$lib/components/ui/switch';
	import CheckIcon from '@lucide/svelte/icons/check';

	const preferences = $state([{ id: 'sms', label: 'Posílat zprávy', checked: true }]);

	function handleSave() {
		// placeholder — will be wired to API
	}
</script>

<div class="flex min-h-svh items-center justify-center bg-muted/40 p-4">
	<Card.Root class="w-full max-w-xl">
		<Card.Header>
			<Card.Title class="text-lg">SMS Preferences</Card.Title>
			<Card.Description>
				Select the types of SMS messages you would like to receive from us. You can change these
				preferences at any time.
			</Card.Description>
		</Card.Header>

		<Card.Content>
			<ul class="divide-y">
				{#each preferences as pref (pref.id)}
					<li class="flex justify-between gap-6 py-3">
						<label for={pref.id} class="text-sm">
							{pref.label}
						</label>
						<Switch id={pref.id} bind:checked={pref.checked} class="shrink-0" />
					</li>
				{/each}
			</ul>
		</Card.Content>

		<Card.Footer class="justify-between">
			<LanguageSwitch />
			<Button onclick={handleSave}>
				<CheckIcon />
				Save Settings
			</Button>
		</Card.Footer>
	</Card.Root>
</div>

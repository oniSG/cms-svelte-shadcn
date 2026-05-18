<script lang="ts">
	import LanguageSwitch from '$lib/components/custom/language-select.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Switch } from '$lib/components/ui/switch';
	import CheckIcon from '@lucide/svelte/icons/check';
	import * as m from '$lib/paraglide/messages.js';

	const preferences = $state([
		{ id: 'marketing', checked: true },
		{ id: 'organizer', checked: true },
		{ id: 'events', checked: true }
	]);

	const preferenceLabel: Record<string, () => string> = {
		marketing: m.email_prefs_marketing,
		organizer: m.email_prefs_organizer,
		events: m.email_prefs_events
	};

	function handleSave() {
		// placeholder — will be wired to API
	}
</script>

<div class="flex min-h-svh items-center justify-center bg-background">
	<Card.Root class="w-full max-w-xl">
		<Card.Header>
			<Card.Title class="text-lg">{m.email_prefs_title()}</Card.Title>
			<Card.Description>{m.email_prefs_description()}</Card.Description>
		</Card.Header>

		<Card.Content>
			<ul class="divide-y">
				{#each preferences as pref (pref.id)}
					<li class="flex justify-between gap-6 py-3">
						<label for={pref.id} class="text-sm">
							{preferenceLabel[pref.id]?.()}
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
				{m.common_save()}
			</Button>
		</Card.Footer>
	</Card.Root>
</div>

<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { localeState, setLocale } from '$lib/i18n.svelte.js';
	import type { Locale } from '$lib/paraglide/runtime.js';

	const languages = [
		{ value: 'cs' as Locale, label: 'Čeština', image: '/flags/cz.svg' },
		{ value: 'en' as Locale, label: 'English', image: '/flags/gb.svg' },
		{ value: 'de' as Locale, label: 'Deutsch', image: '/flags/de.svg' }
	];

	const current = $derived(languages.find((l) => l.value === localeState.current));
</script>

<Select.Root
	type="single"
	value={localeState.current}
	onValueChange={(v) => v && setLocale(v as Locale)}
>
	<Select.Trigger>
		<img src={current?.image} alt={current?.label} class="size-4 rounded-sm" />
		<span>{current?.label}</span>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>{m.lang_label()}</Select.Label>
			{#each languages as lang (lang.value)}
				<Select.Item value={lang.value} label={lang.label}>
					<img src={lang.image} alt={lang.label} class="size-4 rounded-sm" />
					<span>{lang.label}</span>
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

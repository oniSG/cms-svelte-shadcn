<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { localeState, setLocale } from '$lib/i18n.svelte.js';
	import type { Locale } from '$lib/paraglide/runtime.js';
	import LanguagesIcon from '@lucide/svelte/icons/languages';

	const languages = $derived<{ value: Locale; label: string; image: string }[]>([
		{ value: 'cs', label: m.lang_czech(), image: '/flags/cz.svg' },
		{ value: 'en', label: m.lang_english(), image: '/flags/gb.svg' },
		{ value: 'de', label: m.lang_german(), image: '/flags/de.svg' }
	]);

	const current = $derived(languages.find((l) => l.value === localeState.current));
</script>

<DropdownMenu.Sub>
	<DropdownMenu.SubTrigger>
		{#if current}
			<img src={current.image} alt={current.label} class="size-4 rounded-sm" />
		{:else}
			<LanguagesIcon />
		{/if}
		{current?.label ?? languages[0].label}
	</DropdownMenu.SubTrigger>
	<DropdownMenu.SubContent class="min-w-36">
		<DropdownMenu.RadioGroup
			value={localeState.current}
			onValueChange={(v) => v && setLocale(v as Locale)}
		>
			{#each languages as lang (lang.value)}
				<DropdownMenu.RadioItem value={lang.value}>
					<img src={lang.image} alt={lang.label} class="size-4 rounded-sm" />
					{lang.label}
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.SubContent>
</DropdownMenu.Sub>

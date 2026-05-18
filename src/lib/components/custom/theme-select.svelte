<script lang="ts">
	import { setMode, resetMode, userPrefersMode } from 'mode-watcher';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import MonitorIcon from '@lucide/svelte/icons/monitor';

	type Theme = 'light' | 'dark' | 'system';

	const themes = $derived<{ value: Theme; label: string }[]>([
		{ value: 'light', label: m.theme_light() },
		{ value: 'dark', label: m.theme_dark() },
		{ value: 'system', label: m.theme_system() }
	]);

	const current = $derived<Theme>(userPrefersMode.current ?? 'system');

	function onValueChange(v: string | undefined) {
		if (!v) return;
		if (v === 'system') resetMode();
		else setMode(v as 'light' | 'dark');
	}
</script>

<Select.Root type="single" value={current} {onValueChange}>
	<Select.Trigger>
		{#if current === 'light'}
			<SunIcon class="size-4" />
		{:else if current === 'dark'}
			<MoonIcon class="size-4" />
		{:else}
			<MonitorIcon class="size-4" />
		{/if}
		<span>{themes.find((t) => t.value === current)?.label ?? 'System'}</span>
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>{m.theme_label()}</Select.Label>
			{#each themes as theme (theme.value)}
				<Select.Item value={theme.value} label={theme.label}>
					{#if theme.value === 'light'}
						<SunIcon class="size-4" />
					{:else if theme.value === 'dark'}
						<MoonIcon class="size-4" />
					{:else}
						<MonitorIcon class="size-4" />
					{/if}
					<span>{theme.label}</span>
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>

<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { resetMode, setMode, userPrefersMode } from 'mode-watcher';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';

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

<DropdownMenu.Sub>
	<DropdownMenu.SubTrigger>
		{#if current === 'light'}
			<SunIcon />
		{:else if current === 'dark'}
			<MoonIcon />
		{:else}
			<MonitorIcon />
		{/if}
		{themes.find((t) => t.value === current)?.label ?? m.theme_system()}
	</DropdownMenu.SubTrigger>
	<DropdownMenu.SubContent class="min-w-36">
		<DropdownMenu.RadioGroup value={current} {onValueChange}>
			{#each themes as theme (theme.value)}
				<DropdownMenu.RadioItem value={theme.value}>
					{#if theme.value === 'light'}
						<SunIcon />
					{:else if theme.value === 'dark'}
						<MoonIcon />
					{:else}
						<MonitorIcon />
					{/if}
					{theme.label}
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.SubContent>
</DropdownMenu.Sub>

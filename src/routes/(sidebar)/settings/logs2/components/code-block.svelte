<script lang="ts">
	import { codeToHtml } from 'shiki';
	import { mode } from 'mode-watcher';

	type Props = {
		code: string;
		lang?: string;
		theme?: string;
	};

	let { code, lang = 'json', theme }: Props = $props();

	const resolvedTheme = $derived(
		theme ?? (mode.current === 'dark' ? 'github-dark' : 'github-light')
	);

	const htmlPromise = $derived(
		code ? codeToHtml(code, { lang, theme: resolvedTheme }) : Promise.resolve('')
	);
</script>

{#await htmlPromise then html}
	{#if html}
		<div class="overflow-x-scroll rounded-md border p-4 [&_pre]:!bg-transparent">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html html}
		</div>
	{/if}
{/await}

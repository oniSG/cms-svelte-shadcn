<script lang="ts" generics="Row">
	import { getContext, type Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import { cn } from '$lib/utils.js';
	import { ROW_ACTIONS_KEY, type RowActionsContext } from './context';

	let {
		row,
		sheet,
		href,
		onClick,
		menu,
		children
	}: {
		row: Row;
		sheet?: Snippet<[Row]>;
		href?: (row: Row) => Pathname;
		onClick?: (row: Row) => void;
		menu?: Snippet<[Row]>;
		children: Snippet<[Record<string, unknown>]>;
	} = $props();

	const ctx = getContext<RowActionsContext | undefined>(ROW_ACTIONS_KEY);
	const rowActions = $derived(ctx?.get());
	const title = $derived(ctx?.title(row));
	const showContext = $derived(!!(rowActions || menu));

	const isInteractive = $derived(!!(sheet || href || onClick));

	const cursorClass = $derived(
		isInteractive ? 'hover:cursor-pointer' : showContext ? 'hover:cursor-context-menu' : ''
	);

	const accessibility = $derived<Record<string, unknown>>(
		isInteractive ? { role: 'button', tabindex: 0 } : {}
	);

	function mergeChildProps(...sources: Array<Record<string, unknown> | undefined>) {
		const out: Record<string, unknown> = {};
		const classes: unknown[] = [cursorClass];
		for (const s of sources) {
			if (!s) continue;
			for (const [k, v] of Object.entries(s)) {
				if (k === 'class') classes.push(v);
				else out[k] = v;
			}
		}
		out.class = cn(...(classes as string[]));
		return { ...accessibility, ...out };
	}

	function handleClick() {
		if (href) goto(resolve(href(row)));
		else if (onClick) onClick(row);
	}
</script>

{#snippet inner()}
	{#if sheet}
		<Sheet.Root>
			<Sheet.Trigger>
				{#snippet child({ props })}
					{@render children(mergeChildProps(props))}
				{/snippet}
			</Sheet.Trigger>
			<Sheet.Content>
				{@render sheet(row)}
			</Sheet.Content>
		</Sheet.Root>
	{:else if href || onClick}
		{@render children(mergeChildProps({ onclick: handleClick }))}
	{:else}
		{@render children(mergeChildProps())}
	{/if}
{/snippet}

{#if showContext}
	<ContextMenu.Root>
		<ContextMenu.Trigger>
			{#snippet child({ props })}
				{#if sheet}
					<Sheet.Root>
						<Sheet.Trigger>
							{#snippet child({ props: dProps })}
								{@render children(mergeChildProps(props, dProps))}
							{/snippet}
						</Sheet.Trigger>
						<Sheet.Content>{@render sheet(row)}</Sheet.Content>
					</Sheet.Root>
				{:else if href || onClick}
					{@render children(mergeChildProps(props, { onclick: handleClick }))}
				{:else}
					{@render children(mergeChildProps(props))}
				{/if}
			{/snippet}
		</ContextMenu.Trigger>
		<ContextMenu.Content>
			{#if title}
				<ContextMenu.Label class="text-muted-foreground">{title}</ContextMenu.Label>
				<ContextMenu.Separator />
			{/if}
			{#if rowActions}
				{@render rowActions(row, {
					Item: ContextMenu.Item,
					Separator: ContextMenu.Separator
				})}
			{:else if menu}
				{@render menu(row)}
			{/if}
		</ContextMenu.Content>
	</ContextMenu.Root>
{:else}
	{@render inner()}
{/if}

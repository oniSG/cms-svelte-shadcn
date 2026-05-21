<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Snippet } from 'svelte';

	let {
		breadcrumbs,
		children
	}: { breadcrumbs: Array<{ title: string; url?: Pathname }>; children?: Snippet<[]> } = $props();

	const ITEMS_TO_DISPLAY = 3;
	let open = $state(false);
</script>

<header
	class="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14"
>
	<div class="flex w-full items-center justify-between">
		<div class="flex items-center gap-2">
			<Sidebar.Trigger class="-ms-1" />
			<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />

			<Breadcrumb.Root>
				<Breadcrumb.List>
					<!-- First item always visible -->
					<Breadcrumb.Item>
						{#if breadcrumbs[0]?.url}
							<Breadcrumb.Link href={resolve(breadcrumbs[0].url)}>
								{breadcrumbs[0].title}
							</Breadcrumb.Link>
						{:else}
							<Breadcrumb.Page>{breadcrumbs[0]?.title}</Breadcrumb.Page>
						{/if}
					</Breadcrumb.Item>

					{#if breadcrumbs.length > 1}
						<Breadcrumb.Separator />
					{/if}

					<!-- Collapse middle items into dropdown when more than ITEMS_TO_DISPLAY -->
					{#if breadcrumbs.length > ITEMS_TO_DISPLAY}
						<Breadcrumb.Item>
							<DropdownMenu.Root bind:open>
								<DropdownMenu.Trigger class="flex items-center gap-1" aria-label="Toggle menu">
									<Breadcrumb.Ellipsis class="size-4" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="start">
									{#each breadcrumbs.slice(1, -(ITEMS_TO_DISPLAY - 1)) as item, i (i)}
										<DropdownMenu.Item>
											{#if item.url}
												<a href={resolve(item.url)}>{item.title}</a>
											{:else}
												{item.title}
											{/if}
										</DropdownMenu.Item>
									{/each}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Breadcrumb.Item>
						<Breadcrumb.Separator />
					{/if}

					<!-- Last ITEMS_TO_DISPLAY-1 items always visible -->
					{#each breadcrumbs.length > ITEMS_TO_DISPLAY ? breadcrumbs.slice(-(ITEMS_TO_DISPLAY - 1)) : breadcrumbs.slice(1) as item, i (i)}
						{#if i > 0}
							<Breadcrumb.Separator />
						{/if}
						<Breadcrumb.Item>
							{#if item.url}
								<Breadcrumb.Link href={resolve(item.url)} class="max-w-20 truncate md:max-w-none">
									{item.title}
								</Breadcrumb.Link>
							{:else}
								<Breadcrumb.Page class="max-w-20 truncate md:max-w-none">
									{item.title}
								</Breadcrumb.Page>
							{/if}
						</Breadcrumb.Item>
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</div>
		<div class="flex items-center gap-2">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</header>

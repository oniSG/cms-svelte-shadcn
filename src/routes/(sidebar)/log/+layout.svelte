<!--
  +layout.svelte — wraps the log page (and any sub-pages) with a
  TanStack Query "client".

  TanStack Query needs a single shared `QueryClient` instance that holds
  the cache and coordinates all queries. Components further down (like
  `+page.svelte`) discover it via context — that's what `QueryClientProvider`
  sets up.

  Scoping it to this layout file (instead of the root one) keeps the
  query client local to the log feature — other pages aren't affected.
  When you move to a different route, the cache stays alive in memory,
  so coming back is instant.
-->
<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	// One client per page mount. `refetchOnWindowFocus: false` because a
	// logs table refetching every time you tab back to the browser is
	// jarring (rows can shift, scroll position resets, etc.).
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { refetchOnWindowFocus: false }
		}
	});

	let { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>

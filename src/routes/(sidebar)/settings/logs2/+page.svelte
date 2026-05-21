<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { columns } from './columns.js';
	import DataTable from './components/data-table.svelte';
	import { data } from './data.js';
</script>

<PageHeader breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Settings' }, { title: 'Logs' }]} />
<DataTable {data} {columns} />
<!-- svelte-ignore element_invalid_self_closing_tag -->
<div class="h-4" />

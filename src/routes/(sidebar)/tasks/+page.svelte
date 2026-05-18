<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import DataTable from './components/data-table.svelte';
	import { data } from './data/tasks.js';
</script>

<PageHeader breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Settings' }, { title: 'Logs' }]} />
<DataTable {data} />

<script lang="ts">
    import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
    import { columns } from './columns.js';
    import { data } from './data.js';
    import DataTable from './components/data-table.svelte';
</script>

<PageHeader breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Fans' }, { title: 'Fan Action' }]} />

<DataTable {columns} {data} />
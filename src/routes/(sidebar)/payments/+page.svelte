<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import DataTable from './data-table.svelte';
	import { columns, type Payment } from './columns.js';

	export const data: Payment[] = [
		{ id: '728ed52f', amount: 100, status: 'pending', email: 'm@example.com' },
		{ id: '489e1d42', amount: 125, status: 'processing', email: 'example@gmail.com' },
		{ id: 'd1c3f9a8', amount: 75, status: 'success', email: 'completed@example.com' },
		{ id: 'a2b4c6d8', amount: 200, status: 'failed', email: 'alice@domain.com' },
		{ id: 'e9f1a3b5', amount: 340, status: 'success', email: 'bob@company.org' },
		{ id: 'c7d2e4f6', amount: 89, status: 'pending', email: 'carol@mail.net' },
		{ id: 'f3a1b2c4', amount: 450, status: 'processing', email: 'dave@example.com' },
		{ id: 'b5c6d7e8', amount: 60, status: 'success', email: 'eve@sample.io' },
		{ id: '11a2b3c4', amount: 310, status: 'failed', email: 'frank@test.com' },
		{ id: '22b3c4d5', amount: 175, status: 'pending', email: 'grace@domain.co' },
		{ id: '33c4d5e6', amount: 520, status: 'success', email: 'henry@work.com' },
		{ id: '44d5e6f7', amount: 95, status: 'processing', email: 'iris@place.net' },
		{ id: '55e6f7a8', amount: 410, status: 'failed', email: 'jack@here.org' },
		{ id: '66f7a8b9', amount: 230, status: 'pending', email: 'kate@there.com' },
		{ id: '77a8b9c0', amount: 680, status: 'success', email: 'liam@myco.io' },
		{ id: '88b9c0d1', amount: 145, status: 'processing', email: 'mia@biz.com' },
		{ id: '99c0d1e2', amount: 390, status: 'failed', email: 'noah@firm.net' },
		{ id: 'aa1b2c3d', amount: 55, status: 'pending', email: 'olivia@shop.com' },
		{ id: 'bb2c3d4e', amount: 770, status: 'success', email: 'peter@store.org' },
		{ id: 'cc3d4e5f', amount: 210, status: 'processing', email: 'quinn@hub.co' },
		{ id: 'dd4e5f6a', amount: 490, status: 'failed', email: 'rose@lab.io' },
		{ id: 'ee5f6a7b', amount: 130, status: 'pending', email: 'sam@tech.com' },
		{ id: 'ff6a7b8c', amount: 860, status: 'success', email: 'tina@startup.net' },
		{ id: 'ab7b8c9d', amount: 305, status: 'processing', email: 'uma@agency.com' },
		{ id: 'bc8c9d0e', amount: 415, status: 'failed', email: 'victor@corp.org' },
		{ id: 'cd9d0e1f', amount: 70, status: 'pending', email: 'wendy@ltd.com' },
		{ id: 'de0e1f2a', amount: 550, status: 'success', email: 'xander@inc.io' },
		{ id: 'ef1f2a3b', amount: 185, status: 'processing', email: 'yara@venture.com' },
		{ id: 'fa2a3b4c', amount: 920, status: 'success', email: 'zoe@global.net' },
		{ id: 'ab3b4c5d', amount: 265, status: 'failed', email: 'aaron@systems.com' },
		{ id: 'bc4c5d6e', amount: 480, status: 'pending', email: 'bella@services.org' },
		{ id: 'cd5d6e7f', amount: 115, status: 'processing', email: 'carl@solutions.co' },
		{ id: 'de6e7f8a', amount: 375, status: 'success', email: 'diana@works.io' },
		{ id: 'ef7f8a9b', amount: 640, status: 'failed', email: 'eric@group.com' },
		{ id: 'fa8a9b0c', amount: 50, status: 'pending', email: 'fiona@network.net' },
		{ id: 'ab9b0c1d', amount: 730, status: 'success', email: 'george@cloud.com' },
		{ id: 'bc0c1d2e', amount: 195, status: 'processing', email: 'hana@digital.org' },
		{ id: 'cd1d2e3f', amount: 560, status: 'failed', email: 'ivan@platform.co' },
		{ id: 'de2e3f4a', amount: 285, status: 'pending', email: 'julia@media.io' },
		{ id: 'ef3f4a5b', amount: 810, status: 'success', email: 'kevin@studio.com' }
	];
</script>

<PageHeader breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Settings' }, { title: 'Logs' }]} />
<DataTable {data} {columns} />

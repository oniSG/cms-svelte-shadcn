<script lang="ts">
import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
import { Button } from "$lib/components/ui/button/index.js";
import * as Table from "$lib/components/ui/table/index.js";


const emails = [
	{
		email: "testtest@test.test",
		isActive: "true",
	},
	{
		email: "testtest@test.test",
		isActive: "true",
	},
	{
		email: "testtest@test.test",
		isActive: "false",
	},
	{
		email: "testtest@test.test",
		isActive: "false",
	},
	{
		email: "testtest@test.test",
		isActive: "true",
	},
	{
		email: "testtest@test.test",
		isActive: "true",
	},
	{
		email: "testtest@test.test",
		isActive: "false",
	}
];

</script>
<PageHeader
	breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Settings' }, { title: 'Email for reply' }]}
/>

<div class="flex flex-row justify-between">
	<h1>E-mail pro odpověď</h1>
	<Button>Přidat e-mail</Button>
</div>

<Table.Root>
	<Table.Caption>A list of your recent invoices.</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[100px]">Název</Table.Head>
			<Table.Head>Status</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each emails as email (email)}
			<Table.Row>
				<Table.Cell class="font-medium">{email.email}</Table.Cell>
				<Table.Cell>{email.isActive}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
	<Table.Footer>
		<Table.Row>
			<Table.Cell>Total</Table.Cell>
			<Table.Cell>$2,500.00</Table.Cell>
		</Table.Row>
	</Table.Footer>
</Table.Root>




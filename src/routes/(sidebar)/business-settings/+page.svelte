<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import * as Field from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import CurrencyBlock from './components/currency-block.svelte';

	type ExpirationState = 'none' | 'cancelled' | 'new' | 'ended' | 'waiting' | 'won';
	let expirationState = $state<ExpirationState>('none');
	const expirationStateLabels: Record<ExpirationState, string> = {
		none: m.common_none_selected(),
		cancelled: 'Cancelled',
		new: 'New',
		ended: 'Ended',
		waiting: 'Waiting',
		won: 'Won'
	};

	let allowDiscount = $state(false);
	let openAutomation = $state(false);
	let openInvoicing = $state(false);
	let allowSetup = $state(false);
</script>

<PageHeader
	breadcrumbs={[
		{ title: 'Home', url: '/' },
		{ title: m.sidebar_module_settings() },
		{ title: m.nav_set_biz_settings() }
	]}
/>

<Tabs.Root value="settings" class="my-5 flex flex-col gap-6">
	<Tabs.List>
		<Tabs.Trigger value="settings">{m.nav_set_general()}</Tabs.Trigger>
		<Tabs.Trigger value="currency">{m.nav_set_biz_view_amounts()}</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="settings" class="grid grid-cols-1 gap-5 md:grid-cols-2">
		<Card.Root class="h-min">
			<Card.Header>
				<Card.Title>{m.nav_set_biz_case_filter()}</Card.Title>
				<Card.Description>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque esse veniam quasi
					suscipit, aut illum impedit molestiae at inventore magnam nesciunt voluptas ipsam numquam
					amet, officia, quo nihil reiciendis soluta!
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Field.Group>
					<Field.Field orientation="horizontal">
						<Field.Label>{m.nav_set_biz_allow_discount()}</Field.Label>
						<Switch bind:checked={allowDiscount} />
					</Field.Field>
					<Separator />

					<div class="flex gap-3">
						<Field.Field>
							<Field.Label>{m.nav_set_biz_discount_approval_email()}</Field.Label>
							<Input placeholder="kirkwood@deepvision.cz" required type="mail" />
						</Field.Field>

						<Field.Field>
							<Field.Label>{m.nav_set_biz_contract_preparation_email()}</Field.Label>
							<Input placeholder="kirkwood@deepvision.cz" required type="mail" />
						</Field.Field>
					</div>
				</Field.Group>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>{m.nav_set_biz_board_automation()}</Card.Title>
				<Card.Description>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque esse veniam quasi
					suscipit, aut illum impedit molestiae at inventore magnam nesciunt voluptas ipsam numquam
					amet, officia, quo nihil reiciendis soluta!
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Field.Group>
					<Field.Field class="flex flex-col items-start">
						<Field.Label>{m.nav_set_biz_highlight_days_before_expiry()}</Field.Label>
						<Input placeholder="10" required type="number" class="max-w-1/2" />
					</Field.Field>

					<Field.Field orientation="horizontal">
						<Field.Label>{m.nav_set_biz_enable_status_automation()}</Field.Label>
						<Switch bind:checked={openAutomation} />
					</Field.Field>

					{#if openAutomation}
						<Separator />

						<Select.Root type="single" bind:value={expirationState}>
							<Select.Trigger>
								{m.nav_set_biz_move_to_status_after_expiry()} -
								{expirationStateLabels[expirationState]}
							</Select.Trigger>

							<Select.Content>
								{#each Object.entries(expirationStateLabels) as [value, label]}
									<Select.Item {value}>
										{label}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/if}
				</Field.Group>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>{m.nav_set_biz_enable_invoicing_notifications()}</Card.Title>
				<Card.Description>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque esse veniam quasi
					suscipit, aut illum impedit molestiae at inventore magnam nesciunt voluptas ipsam numquam
					amet, officia, quo nihil reiciendis soluta!
				</Card.Description>
			</Card.Header>

			<Card.Content>
				<Field.Group>
					<Field.Field orientation="horizontal">
						<Field.Label>{m.nav_set_biz_enable_invoicing_notifications()}</Field.Label>
						<Switch bind:checked={openInvoicing} />
					</Field.Field>

					{#if openInvoicing}
						<Separator />

						<div class="flex gap-3">
							<Field.Field>
								<Field.Label>{m.nav_set_biz_invoicing_email()}</Field.Label>
								<Input placeholder="kirkwood@deepvision.cz" required type="mail" />
							</Field.Field>

							<Field.Field>
								<Field.Label>{m.nav_set_biz_invoicing_notification_days()}</Field.Label>
								<Input placeholder="10" required type="num" />
							</Field.Field>
						</div>
					{/if}
				</Field.Group>
			</Card.Content>
		</Card.Root>

		<Card.Root class="h-min">
			<Card.Header>
				<Card.Title>{m.nav_set_biz_revenue_setup()}</Card.Title>
				<Card.Description>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque esse veniam quasi
					suscipit, aut illum impedit molestiae at inventore magnam nesciunt voluptas ipsam numquam
					amet, officia, quo nihil reiciendis soluta!
				</Card.Description>
			</Card.Header>

			<Card.Content>
				<Field.Field orientation="horizontal">
					<Field.Label>
						{m.nav_set_biz_owner_only_edit()}
					</Field.Label>
					<Switch bind:checked={allowSetup} />
				</Field.Field>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="currency">
		<Accordion.Root type="multiple" class="w-full" value={['item-1']}>
			<CurrencyBlock name="Česká koruna" item="item-1" />
			<CurrencyBlock name="Euro" item="item-2" />
			<CurrencyBlock name="Dollar" item="item-3" />
		</Accordion.Root>
	</Tabs.Content>
</Tabs.Root>

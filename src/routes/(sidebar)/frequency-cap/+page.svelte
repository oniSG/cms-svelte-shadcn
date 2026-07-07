<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import * as Field from '$lib/components/ui/field';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import * as m from '$lib/paraglide/messages.js';

	let openEmail = $state(false);
	let openPush = $state(false);
	let openMobile = $state(false);
</script>

<PageHeader
	breadcrumbs={[
		{ title: 'Home', url: '/' },
		{ title: m.sidebar_module_settings() },
		{ title: m.nav_set_fans_send_frequency() }
	]}
/>

<div class="m-4">
	<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
		<Card.Root class="h-min">
			<Card.Header>
				<Card.Title>E-mail</Card.Title>
				<Card.Description>{m.nav_frequency_info()}</Card.Description>
			</Card.Header>

			<Card.Content>
				<Field.Group>
					<Field.Field orientation="horizontal">
						<Field.Label>{m.nav_set_fans_send_frequency()}</Field.Label>
						<Switch bind:checked={openEmail} />
					</Field.Field>

					{#if openEmail}
						<Separator />

						<div class="flex gap-6">
							<Field.Field>
								<Field.Label>{m.nav_allowed_sending()}</Field.Label>
								<Input type="number" placeholder="10" required class="max-w-xs" />
							</Field.Field>

							<Field.Field>
								<Field.Label>{m.nav_days_count()}</Field.Label>
								<Input type="number" placeholder="1" required class="max-w-xs" />
							</Field.Field>
						</div>
					{/if}
				</Field.Group>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Push</Card.Title>
				<Card.Description>{m.nav_frequency_info()}</Card.Description>
			</Card.Header>

			<Card.Content>
				<Field.Group>
					<Field.Field orientation="horizontal">
						<Field.Label>{m.nav_set_fans_send_frequency()}</Field.Label>
						<Switch bind:checked={openPush} />
					</Field.Field>

					{#if openPush}
						<Separator />

						<div class="flex gap-6">
							<Field.Field>
								<Field.Label>{m.nav_allowed_sending()}</Field.Label>
								<Input type="number" placeholder="10" required class="max-w-xs" />
							</Field.Field>

							<Field.Field>
								<Field.Label>{m.nav_days_count()}</Field.Label>
								<Input type="number" placeholder="1" required class="max-w-xs" />
							</Field.Field>
						</div>
					{/if}
				</Field.Group>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>{m.nav_mobile_message()}</Card.Title>
				<Card.Description>{m.nav_frequency_info()}</Card.Description>
			</Card.Header>

			<Card.Content>
				<Field.Group>
					<Field.Field orientation="horizontal">
						<Field.Label>{m.nav_set_fans_send_frequency()}</Field.Label>
						<Switch bind:checked={openMobile} />
					</Field.Field>

					{#if openMobile}
						<Separator />

						<div class="flex gap-6">
							<Field.Field>
								<Field.Label>{m.nav_allowed_sending()}</Field.Label>
								<Input type="number" placeholder="10" required class="max-w-xs" />
							</Field.Field>

							<Field.Field>
								<Field.Label>{m.nav_days_count()}</Field.Label>
								<Input type="number" placeholder="1" required class="max-w-xs" />
							</Field.Field>
						</div>
					{/if}
				</Field.Group>
			</Card.Content>
		</Card.Root>
	</div>
</div>

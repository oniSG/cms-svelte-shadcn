<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
</script>

<PageHeader
	breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Settings' }, { title: 'Frequency cap' }]}
/>

<div class="mb-10 border-gray-200">
	<div class="flex items-center justify-between px-6 py-4">
		<h3 class="text-lg font-medium">Frekvence odesílání</h3>
		<Button>Uložit</Button>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2">
		<Card.Root class="mb-4 ml-6">
			<Card.Header>
				<Card.Title>E-mail</Card.Title>
			</Card.Header>

			<Card.Content>
				<div class="mb-10 flex items-center gap-3">
					<Checkbox
						id="email-checkbox-frequency-cap"
						class="text-white data-[state=checked]:border-lime-500 data-[state=checked]:bg-lime-500"
					/>
					<Label for="email-checkbox-frequency-cap" class="cursor-pointer"
						>Zapnout frekvence odesílání</Label
					>
				</div>

				<form>
					<div class="flex flex-col gap-6">
						<div class="grid gap-2">
							<Label for="email-frequency-cap">Povolený počet odesílání</Label>
							<Input id="email-frequency-cap" type="number" placeholder="10" required />
						</div>

						<div class="grid gap-2">
							<Label for="email-days-count">Počet dní</Label>
							<Input id="email-days-count" type="number" placeholder="1" required />
						</div>
					</div>
				</form>
			</Card.Content>
		</Card.Root>

		<Card.Root class="mb-4 ml-6">
			<Card.Header>
				<Card.Title>Push</Card.Title>
			</Card.Header>

			<Card.Content>
				<div class="mb-10 flex items-center gap-3">
					<Checkbox
						id="push-checkbox-frequency-cap"
						class="text-white data-[state=checked]:border-lime-500 data-[state=checked]:bg-lime-500"
					/>
					<Label for="push-checkbox-frequency-cap" class="cursor-pointer"
						>Zapnout frekvence odesílání</Label
					>
				</div>

				<form>
					<div class="flex flex-col gap-6">
						<div class="grid gap-2">
							<Label for="push-frequency-cap">Povolený počet odesílání</Label>
							<Input id="push-frequency-cap" type="number" placeholder="10" required />
						</div>

						<div class="grid gap-2">
							<Label for="push-days-count">Počet dní</Label>
							<Input id="push-days-count" type="number" placeholder="1" required />
						</div>
					</div>
				</form>
			</Card.Content>
		</Card.Root>

		<Card.Root class="mb-4 ml-6">
			<Card.Header>
				<Card.Title>Mobilní zpráva</Card.Title>
			</Card.Header>

			<Card.Content>
				<div class="mb-10 flex items-center gap-3">
					<Checkbox
						id="mobile-checkbox-frequency-cap"
						class="text-white data-[state=checked]:border-lime-500 data-[state=checked]:bg-lime-500"
					/>
					<Label for="mobile-checkbox-frequency-cap" class="cursor-pointer"
						>Zapnout frekvence odesílání</Label
					>
				</div>

				<form>
					<div class="flex flex-col gap-6">
						<div class="grid gap-2">
							<Label for="mobile-frequency-cap">Povolený počet odesílání</Label>
							<Input id="mobile-frequency-cap" type="number" placeholder="10" required />
						</div>

						<div class="grid gap-2">
							<Label for="mobile-days-count">Počet dní</Label>
							<Input id="mobile-days-count" type="number" placeholder="1" required />
						</div>
					</div>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
</div>

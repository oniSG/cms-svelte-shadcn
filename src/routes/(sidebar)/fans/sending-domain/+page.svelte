<script lang="ts">
	import 	PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
</script>

<PageHeader breadcrumbs={[{ title: 'Home', url: '/' },{ title: 'Settings' },{ title: 'Sending domain' }]} />

<div class="flex items-center justify-between mb-6">
	<h1 class="text-3xl font-bold">Odesílací domény</h1>
	<div class="flex items-center gap-4">

		<Button class="text-secondary-foreground bg-secondary" variant="default">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-repeat2-icon lucide-repeat-2"><path d="m2 9 3-3 3 3"/><path d="M13 18H7a2 2 0 0 1-2-2V6"/><path d="m22 15-3 3-3-3"/><path d="M11 6h6a2 2 0 0 1 2 2v10"/></svg>
			Znovu zkontrolovat vše
		</Button>
		<Button class="" variant="default">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
			Vytvořit doménu
		</Button>
	</div>
</div>

<Card.Root>
	<Card.Header class="flex items-center justify-between">
		<div class="flex flex-row items-center gap-4">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe-icon lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
			<div>
				<Card.Description>Info relatoo</Card.Description>
				<Card.Title>Relatoo.cz</Card.Title>
			</div>
		</div>

		<div class="flex flex-col items-end">
			<Badge class="p-4 bg-primary text-primary-foreground">Doména ověřena</Badge>
			<Card.Description>Naposledy zkontrolováno před 2 minutami</Card.Description>
		</div>
	</Card.Header>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

		<Card.Content>
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center justify-between">
						DKIM
						<Badge variant="secondary" class="bg-primary text-primary-foreground">
							<BadgeCheckIcon />
							Ověřeno
						</Badge>
					</Card.Title>
					<Card.Description>Podpisový klíč e-mailů</Card.Description>
				</Card.Header>
				<Card.Content>
					<Label for="dkim_host" class="m-2">HOST / NÁZEV</Label>
					<Input id="dkim_host" disabled type="text" value="asgasdgasgafdgadfgadfgdfgadg"/>
				</Card.Content>
				<Card.Content>
					<div class="flex items-center justify-between">
						<Label for="dkim_host" class="m-2">HODNOTA</Label>
					</div>

					<Input id="dkim_host" disabled type="text" value="asgasdgasgafdgadfgadfgdfgadg"/>
				</Card.Content>
				<Card.Footer class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
					<p>Naposledy ověřeno před 2 min</p>
				</Card.Footer>
			</Card.Root>
	</Card.Content>

		<Card.Content>
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center justify-between">
					DMARC
					<Badge variant="secondary" class="bg-primary text-primary-foreground">
						<BadgeCheckIcon />
						Ověřeno
					</Badge>
				</Card.Title>
				<Card.Description>Politika ochrany domény</Card.Description>
			</Card.Header>
			<Card.Content>
				<Label for="dkim_host" class="m-2">HOST / NÁZEV</Label>
				<Input id="dkim_host" disabled type="text" value="asgasdgasgafdgadfgadfgdfgadg"/>
			</Card.Content>
			<Card.Content>
				<Label for="dkim_host" class="m-2">HODNOTA</Label>
				<Input id="dkim_host" disabled type="text" value="asgasdgasgafdgadfgadfgdfgadg"/>
			</Card.Content>
			<Card.Footer class="flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
				<p>Naposledy ověřeno před 2 min</p>
			</Card.Footer>
		</Card.Root>
	</Card.Content>

		<Card.Content>
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center justify-between">
					SPF
					<Badge variant="secondary" class="text-secondary-foreground bg-secondary">
						Přidán automaticky
					</Badge>
				</Card.Title>
				<Card.Description>Povolení odesílatelé</Card.Description>
			</Card.Header>
			<Card.Content>
				<Label for="dkim_host" class="m-2">HOST / NÁZEV</Label>
				<Input id="dkim_host" disabled type="text" value="asgasdgasgafdgadfgadfgdfgadg"/>
			</Card.Content>
			<Card.Content>
				<Label for="dkim_host" class="m-2">HODNOTA</Label>
				<Input id="dkim_host" disabled type="text" value="asgasdgasgafdgadfgadfgdfgadg"/>
			</Card.Content>
			<Card.Footer class="flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
				<p>Naposledy ověřeno před 2 min</p>
			</Card.Footer>
		</Card.Root>
	</Card.Content>
	</div>
	<Card.Footer class="flex items-center gap-2 text-secondary-foreground">
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--secondary-foreground)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
		<p>Změny v DNS se mohou projevit až za 24 hodin. Status obnovujeme automaticky každou hodinu.</p>
	</Card.Footer>
</Card.Root>

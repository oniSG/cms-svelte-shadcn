<script lang="ts">
	import PageHeader from '$lib/components/custom/sidebar/page-header.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import RefreshCcwIcon from '@lucide/svelte/icons/refresh-ccw';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import InfoIcon from '@lucide/svelte/icons/info';
	import * as ButtonGroup from '$lib/components/ui/button-group';
	import * as InputGroup from '$lib/components/ui/input-group';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
</script>

<PageHeader
	breadcrumbs={[{ title: 'Home', url: '/' }, { title: 'Settings' }, { title: 'Sending domain' }]}
>
	<Drawer.Root direction="right">
		<Drawer.Trigger>
			<Button variant="outline" size="icon">
				<InfoIcon />
			</Button>
		</Drawer.Trigger>
		<Drawer.Content>
			<div
				class="prose prose-sm min-h-0 flex-1 overflow-y-auto px-6 py-6 dark:prose-invert prose-code:before:content-none prose-code:after:content-none"
			>
				<h2>What is a sending domain?</h2>
				<p>
					A sending domain is the domain used in the <code>From:</code> address of your emails. Authenticating
					it proves to receiving mail servers that you are authorized to send on behalf of that domain,
					which dramatically improves deliverability and protects your brand from spoofing.
				</p>

				<h2>Required DNS records</h2>
				<p>You need to add three types of records to your domain's DNS zone.</p>

				<h3>DKIM — DomainKeys Identified Mail</h3>
				<p>
					DKIM attaches a cryptographic signature to every outgoing message. The receiving server
					fetches your public key from DNS and verifies the signature, confirming the email was not
					tampered with in transit.
				</p>
				<ol>
					<li>Copy the <strong>Host</strong> and <strong>Value</strong> shown on this page.</li>
					<li>In your DNS provider, create a new <code>TXT</code> record with those values.</li>
					<li>
						Propagation can take up to 24 hours. Use the <em>Re-check all</em> button to refresh the status.
					</li>
				</ol>

				<h3>DMARC — Domain-based Message Authentication</h3>
				<p>
					DMARC tells receiving servers what to do when a message fails DKIM or SPF checks — for
					example, reject it or send it to spam. It also enables aggregate reports so you can
					monitor who is sending email from your domain.
				</p>
				<p>A minimal policy to get started:</p>
				<pre><code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code></pre>
				<p>
					Once you are confident in your setup, tighten the policy to <code>p=quarantine</code> or
					<code>p=reject</code>.
				</p>

				<h3>SPF — Sender Policy Framework</h3>
				<p>
					SPF lists the mail servers permitted to send email for your domain. Our platform adds the
					required SPF entry automatically — you do not need to create it manually. If you already
					have an SPF record, we will merge our entry into it.
				</p>

				<h2>Troubleshooting</h2>
				<ul>
					<li>
						<strong>Record not found</strong> — double-check there are no extra spaces in the host
						name and that the record type is <code>TXT</code>.
					</li>
					<li>
						<strong>Still unverified after 24 h</strong> — some registrars cache DNS for up to 48 hours.
						Try a public checker like MXToolbox to confirm the record is live.
					</li>
					<li>
						<strong>Multiple SPF records</strong> — a domain must have exactly one SPF
						<code>TXT</code>
						record. Merge all <code>include:</code> entries into a single record.
					</li>
				</ul>
			</div>
		</Drawer.Content>
	</Drawer.Root>
	<Button variant="secondary">
		<RefreshCcwIcon />
		Znovu zkontrolovat vše
	</Button>
	<Button variant="default">
		<PlusIcon />
		Vytvořit doménu
	</Button>
</PageHeader>

<Card.Root>
	<Card.Header class="flex items-center justify-between">
		<Card.Title class="flex items-center gap-4">
			<Button
				size="icon-lg"
				variant="outline"
				class="pointer-events-none size-12 border-primary text-primary"
			>
				<GlobeIcon class="size-5" />
			</Button>
			Relatoo.cz
		</Card.Title>

		<div class="flex items-end gap-4">
			<p class="text-sm text-muted-foreground">
				Last checked: <span class="font-medium">2 min ago</span>
			</p>
			<Separator orientation="vertical" class="min-h-4" />
			<Badge>Doména ověřena</Badge>
		</div>
	</Card.Header>
	<Card.Content class="flex w-full items-center gap-12">
		<Card.Root class="w-full border-none shadow-none ring-0 outline-0">
			<Card.Header class="px-0">
				<Card.Title class="flex items-center gap-2">
					DKIM
					<Badge variant="outline">Neověřeno</Badge>
				</Card.Title>
				<Card.Description>Nastavení DKIM záznamu pro ověření domény</Card.Description>
			</Card.Header>
			<Card.Content class="px-0">
				<Field.Group>
					<Field.Field>
						<Field.Label>Host</Field.Label>
						<ButtonGroup.Root>
							<InputGroup.Root>
								<InputGroup.Input type="text" value="asgasdgasgafdgadfgadfgdfgadg" disabled />
							</InputGroup.Root>
							<Button>
								<CopyIcon />
							</Button>
						</ButtonGroup.Root>
					</Field.Field>
					<Field.Field>
						<Field.Label>Hodnota</Field.Label>
						<ButtonGroup.Root>
							<InputGroup.Root>
								<InputGroup.Input type="text" value="asgasdgasgafdgadfgadfgdfgadg" disabled />
							</InputGroup.Root>
							<Button>
								<CopyIcon />
							</Button>
						</ButtonGroup.Root>
					</Field.Field>
				</Field.Group>
			</Card.Content>
		</Card.Root>

		<!-- <Separator orientation="vertical" class="min-h-40" /> -->

		<Card.Root class="w-full border-none shadow-none ring-0 outline-0">
			<Card.Header class="px-0">
				<Card.Title class="flex items-center gap-2"
					>DMARC
					<Badge>Overeno</Badge>
				</Card.Title>
				<Card.Description>Nastavení DMARC záznamu pro ochranu domény</Card.Description>
			</Card.Header>
			<Card.Content class="px-0">
				<Field.Group>
					<Field.Field>
						<Field.Label>Host</Field.Label>
						<ButtonGroup.Root>
							<InputGroup.Root>
								<InputGroup.Input type="text" value="asgasdgasgafdgadfgadfgdfgadg" disabled />
							</InputGroup.Root>
							<Button>
								<CopyIcon />
							</Button>
						</ButtonGroup.Root>
					</Field.Field>
					<Field.Field>
						<Field.Label>Hodnota</Field.Label>
						<ButtonGroup.Root>
							<InputGroup.Root>
								<InputGroup.Input type="text" value="asgasdgasgafdgadfgadfgdfgadg" disabled />
							</InputGroup.Root>
							<Button>
								<CopyIcon />
							</Button>
						</ButtonGroup.Root>
					</Field.Field>
				</Field.Group>
			</Card.Content>
		</Card.Root>

		<!-- <Separator orientation="vertical" class="min-h-40" /> -->

		<Card.Root class="w-full border-none shadow-none ring-0 outline-0">
			<Card.Header class="px-0">
				<Card.Title class="flex items-center gap-2"
					>SPF
					<Badge variant="outline">Neověřeno</Badge>
				</Card.Title>
				<Card.Description
					>Nastavení SPF se přidá automaticky, není potřeba ho přidávat ručně</Card.Description
				>
			</Card.Header>
			<Card.Content class="px-0">
				<Field.Group>
					<Field.Field>
						<Field.Label>Host</Field.Label>
						<ButtonGroup.Root>
							<InputGroup.Root>
								<InputGroup.Input type="text" value="asgasdgasgafdgadfgadfgdfgadg" disabled />
							</InputGroup.Root>
							<Button>
								<CopyIcon />
							</Button>
						</ButtonGroup.Root>
					</Field.Field>
					<Field.Field>
						<Field.Label>Hodnota</Field.Label>
						<ButtonGroup.Root>
							<InputGroup.Root>
								<InputGroup.Input type="text" value="asgasdgasgafdgadfgadfgdfgadg" disabled />
							</InputGroup.Root>
							<Button>
								<CopyIcon />
							</Button>
						</ButtonGroup.Root>
					</Field.Field>
				</Field.Group>
			</Card.Content>
		</Card.Root>
	</Card.Content>

	<Card.Footer class="flex items-center gap-2 text-sm text-muted-foreground">
		<InfoIcon class="size-5" />
		<p>
			Změny v DNS se mohou projevit až za 24 hodin. Status obnovujeme automaticky každou hodinu.
		</p>
	</Card.Footer>
</Card.Root>

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

	import * as m from '$lib/paraglide/messages.js';
</script>

<PageHeader
	breadcrumbs={[{ title: 'Home', url: '/' }, { title: m.sidebar_module_settings() }, { title: m.nav_set_fans_sending_domains() }]}
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
				<h2>{m.domain_drawer_title()}</h2>
				<p>{m.domain_drawer_sending_domain_body()}</p>

				<h2>{m.domain_drawer_dns_title()}</h2>
				<p>{m.domain_drawer_dns_body()}</p>

				<h3>DKIM — DomainKeys Identified Mail</h3>
				<p>{m.domain_drawer_dkim_body()}</p>
				<ol>
					<li>{m.domain_drawer_dkim_step1()}</li>
					<li>{m.domain_drawer_dkim_step2()}</li>
					<li>{m.domain_drawer_dkim_step3()}</li>
				</ol>

				<h3>DMARC — Domain-based Message Authentication</h3>
				<p>{m.domain_drawer_dmarc_body()}</p>
				<p>{m.domain_drawer_dmarc_minimal()}</p>
				<pre><code>v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</code></pre>
				<p>{m.domain_drawer_dmarc_tighten()}</p>

				<h3>SPF — Sender Policy Framework</h3>
				<p>{m.domain_drawer_spf_body()}</p>

				<h2>{m.domain_drawer_troubleshooting_title()}</h2>
				<ul>
					<li>{m.domain_drawer_trouble_not_found()}</li>
					<li>{m.domain_drawer_trouble_unverified()}</li>
					<li>{m.domain_drawer_trouble_spf()}</li>
				</ul>
			</div>
		</Drawer.Content>
	</Drawer.Root>
	<Button variant="secondary">
		<RefreshCcwIcon />
		{m.nav_set_fans_sending_domains_recheck()}
	</Button>
	<Button variant="default">
		<PlusIcon />
		{m.nav_set_fans_sending_domains_create()}
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
				{m.domain_last_checked()}: <span class="font-medium">{m.domain_last_checked_value()}</span>
			</p>
			<Separator orientation="vertical" class="min-h-4" />
			<Badge>{m.domain_verified()}</Badge>
		</div>
	</Card.Header>
	<Card.Content class="flex w-full items-center gap-12">
		<Card.Root class="w-full border-none shadow-none ring-0 outline-0">
			<Card.Header class="px-0">
				<Card.Title class="flex items-center gap-2">
					DKIM
					<Badge variant="outline">{m.nav_unverified()}</Badge>
				</Card.Title>
				<Card.Description>{m.domain_dkim_description()}</Card.Description>
			</Card.Header>
			<Card.Content class="px-0">
				<Field.Group>
					<Field.Field>
						<Field.Label>{m.domain_host()}</Field.Label>
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
						<Field.Label>{m.domain_value()}</Field.Label>
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
				<Card.Title class="flex items-center gap-2">
					DMARC
					<Badge variant="default">{m.nav_verified()}</Badge>
				</Card.Title>
				<Card.Description>{m.domain_dmarc_description()}</Card.Description>
			</Card.Header>
			<Card.Content class="px-0">
				<Field.Group>
					<Field.Field>
						<Field.Label>{m.domain_host()}</Field.Label>
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
						<Field.Label>{m.domain_value()}</Field.Label>
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
				<Card.Title class="flex items-center gap-2">
					SPF
					<Badge variant="outline">{m.nav_unverified()}</Badge>
				</Card.Title>
				<Card.Description>{m.domain_spf_description()}</Card.Description>
			</Card.Header>
			<Card.Content class="px-0">
				<Field.Group>
					<Field.Field>
						<Field.Label>{m.domain_host()}</Field.Label>
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
						<Field.Label>{m.domain_value()}</Field.Label>
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
		<p>{m.domain_dns_delay()}</p>
	</Card.Footer>
</Card.Root>
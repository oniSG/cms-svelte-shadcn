<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';

	const pages: Array<{
		title: string;
		description: string;
		features: string[];
		original: string;
		href: Pathname;
	}> = [
		{
			title: 'Login',
			description:
				'Minimal sign-in form with email and password fields and client-side validation.',
			features: [
				'Superforms + Zod v4 schema validation',
				'Password show/hide toggle',
				'Forgot password link',
				'SPA submission with toast feedback'
			],
			original: '#',
			href: '/login'
		},
		{
			title: 'Newsletter Subscription',
			description:
				'Multi-field signup form with address details, communication preferences and full client-side validation.',
			features: [
				'Superforms + Zod v4 schema validation',
				'Custom date picker with calendar popover',
				'Phone code selector with country flags',
				'Country selector with flag icons',
				'SPA submission with toast feedback'
			],
			original: '#',
			href: '/newsletter'
		},
		{
			title: 'Unsubscribe Email',
			description:
				'Granular email preference management letting users toggle per-category subscriptions.',
			features: [
				'Per-category email preference toggles',
				'Marketing, organizer and event categories',
				'Language switcher'
			],
			original: '#',
			href: '/unsubscribe-email'
		},
		{
			title: 'Unsubscribe SMS',
			description: 'Minimal SMS opt-out page with a single preference toggle.',
			features: ['SMS opt-in / opt-out toggle', 'Single-preference layout', 'Language switcher'],
			original: '#',
			href: '/unsubscribe-sms'
		},
		{
			title: 'Unsubscribed Confirmation',
			description: 'Post-unsubscribe confirmation screen acknowledging the user action.',
			features: ['Confirmation state card', 'Czech localisation', 'Close action button'],
			original: '#',
			href: '/unsubscribed'
		}
	];
</script>

<div class="pt-24">
	<div class="mx-auto max-w-5xl">
		<header class="mb-10">
			<p class="mb-1 text-sm font-medium text-primary">CMS Svelte / shadcn</p>
			<h1 class="text-3xl font-semibold tracking-tight">Template Pages</h1>
			<p class="mt-2 text-muted-foreground">
				Svelte 5 + SvelteKit rewrites of the React CRM. Click a card to open the new version.
			</p>
		</header>

		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
			{#each pages as page, i (i)}
				<Card.Root class="group relative flex flex-col transition-shadow hover:shadow-md">
					<Card.Header>
						<Card.Title>
							<a
								href={resolve(page.href)}
								class="group-hover:text-primary after:absolute after:inset-0 after:rounded-[inherit]"
							>
								{page.title}
							</a>
						</Card.Title>
						<Card.Description>{page.description}</Card.Description>
					</Card.Header>

					<Card.Content class="flex-1">
						<ul class="space-y-1.5">
							{#each page.features as feature, j (j)}
								<li class="flex items-start gap-2 text-sm text-foreground/80">
									<span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
									{feature}
								</li>
							{/each}
						</ul>
					</Card.Content>

					<Card.Footer class="relative z-10 gap-2">
						<Button variant="outline" size="sm" href={page.original} target="_blank">
							Original
							<ExternalLinkIcon />
						</Button>
						<Button size="sm" href={resolve(page.href)}>
							New version
							<ArrowRightIcon />
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</div>
</div>

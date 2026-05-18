<script lang="ts" module>
	import { z } from 'zod';

	export const formSchema = z.object({
		email: z.email('Invalid email address'),
		password: z
			.string()
			.min(1, 'Password is required')
			.max(64, 'Password must be at most 64 characters')
			.refine((val) => /[A-Z]/.test(val), 'Password must contain at least one uppercase letter')
			.refine((val) => /[a-z]/.test(val), 'Password must contain at least one lowercase letter')
			.refine((val) => /[0-9]/.test(val), 'Password must contain at least one number')
			.refine(
				(val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
				'Password must contain at least one special character'
			)
	});
</script>

<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Field from '$lib/components/ui/field';
	import { Button } from '$lib/components/ui/button';
	import * as m from '$lib/paraglide/messages.js';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import EyeOffIcon from '@lucide/svelte/icons/eye-off';
	import LanguageSelect from '$lib/components/custom/language-select.svelte';
	import ThemeSelect from '$lib/components/custom/theme-select.svelte';

	const form = superForm(defaults(zod4(formSchema)), {
		SPA: true,
		validators: zod4Client(formSchema),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				console.log('Login data:', f.data);
				toast.success(m.login_toast_success());
			} else {
				toast.error(m.login_toast_error());
			}
		}
	});

	const { form: formData, enhance } = form;

	let showPassword = $state(false);
</script>

<div class="flex min-h-svh items-center justify-center bg-background">
	<div class="flex w-full max-w-sm flex-col gap-6">
		<form method="POST" use:enhance>
			<Field.Group class="gap-4">
				<div class="flex flex-col items-center gap-2 text-center">
					<img
						src="https://cdn.deepvision.cloud/relatoo/logo/facr.svg?v=2"
						alt="Logo"
						class="mb-6 aspect-square size-32 object-contain"
					/>
				</div>

				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{m.login_email()}</Form.Label>
							<Input
								{...props}
								type="email"
								placeholder="john.doe@example.com"
								bind:value={$formData.email}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex justify-between">
								<Form.Label>{m.login_password()}</Form.Label>
								<a href="#/" class="text-sm text-muted-foreground hover:underline">
									{m.login_forgot_password()}
								</a>
							</div>
							<div class="relative">
								<Input
									{...props}
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									class="pr-10"
									bind:value={$formData.password}
								/>
								<Button
									type="button"
									onclick={() => (showPassword = !showPassword)}
									variant="ghost"
									size="icon"
									tabindex={-1}
									aria-label={showPassword ? m.login_hide_password() : m.login_show_password()}
									class="absolute inset-y-0 right-0.5 text-muted-foreground hover:text-foreground"
								>
									{#if showPassword}
										<EyeOffIcon class="size-4" />
									{:else}
										<EyeIcon class="size-4" />
									{/if}
								</Button>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Field.Field>
					<Form.Button class="w-full">{m.login_submit()}</Form.Button>
				</Field.Field>

				<div class="flex justify-center gap-2">
					<LanguageSelect />
					<ThemeSelect />
				</div>
			</Field.Group>
		</form>

		<Field.Description class="px-6 text-center">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html m.login_terms({
				termsOfService: `<a href="#/">${m.login_terms_of_service()}</a>`,
				privacyPolicy: `<a href="#/">${m.login_privacy_policy()}</a>`
			})}
		</Field.Description>
	</div>
</div>

<script lang="ts" module>
	import { z } from 'zod';

	export const formSchema = z.object({
		name: z.string().min(1, 'First name is required').max(16),
		lastName: z.string().min(1, 'Last name is required').max(16),
		email: z.email('Invalid email address'),
		phoneCode: z.string().optional().default('+420'),
		phone: z.string().optional().default(''),
		birthDate: z
			.date()
			.optional()
			.refine((date) => !date || date <= new Date(), 'Birth date cannot be in the future'),
		country: z.string().optional().default('czech'),
		city: z.string().optional(),
		street: z.string().optional(),
		number: z.string().optional(),
		zip: z.string().optional()
	});
</script>

<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as m from '$lib/paraglide/messages.js';

	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import CheckIcon from '@lucide/svelte/icons/check';

	import LanguageSwitch from '$lib/components/custom/language-select.svelte';
	import PhoneCodeSelect from '$lib/components/custom/phone-code-select.svelte';
	import DatePicker from '$lib/components/custom/date-picker.svelte';
	import CountrySelect from '$lib/components/custom/country-select.svelte';

	const form = superForm(defaults(zod4(formSchema)), {
		SPA: true,
		validators: zod4Client(formSchema),
		onUpdate: ({ form: f }) => {
			if (f.valid) {
				console.log('Valid form data:', f.data);
				toast.success(m.newsletter_toast_success());
			} else {
				toast.error(m.newsletter_toast_error());
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex min-h-svh items-center justify-center bg-background">
	<Card.Root class="w-full max-w-xl">
		<Card.Header>
			<Card.Title class="text-lg">{m.newsletter_title()}</Card.Title>
			<Card.Description>{m.newsletter_description()}</Card.Description>
		</Card.Header>

		<form method="POST" use:enhance>
			<Card.Content class="flex flex-col gap-5 pb-6">
				<div class="grid grid-cols-2 gap-4">
					<Form.Field {form} name="name">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.newsletter_first_name()}</Form.Label>
								<Input
									{...props}
									placeholder={m.newsletter_ph_first_name()}
									bind:value={$formData.name}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="lastName">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.newsletter_last_name()}</Form.Label>
								<Input
									{...props}
									placeholder={m.newsletter_ph_last_name()}
									bind:value={$formData.lastName}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<Form.Field {form} name="email">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.newsletter_email()}</Form.Label>
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

					<Form.Field {form} name="phone">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.newsletter_phone()}</Form.Label>
								<div class="flex flex-row gap-2">
									<PhoneCodeSelect bind:value={$formData.phoneCode} />
									<Input
										{...props}
										placeholder={m.newsletter_ph_phone()}
										bind:value={$formData.phone}
									/>
								</div>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<Form.Field {form} name="birthDate">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.newsletter_birth_date()}</Form.Label>
								<DatePicker
									{...props}
									placeholder={m.common_select_date()}
									bind:value={$formData.birthDate}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="country">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.newsletter_country()}</Form.Label>
								<CountrySelect {...props} bind:value={$formData.country} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<Form.Field {form} name="city">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.newsletter_city()}</Form.Label>
								<Input
									{...props}
									placeholder={m.newsletter_ph_city()}
									bind:value={$formData.city}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="street">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.newsletter_street()}</Form.Label>
								<Input
									{...props}
									placeholder={m.newsletter_ph_street()}
									bind:value={$formData.street}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<Form.Field {form} name="number">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.newsletter_number()}</Form.Label>
								<Input
									{...props}
									placeholder={m.newsletter_ph_number()}
									bind:value={$formData.number}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="zip">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>{m.newsletter_zip()}</Form.Label>
								<Input {...props} placeholder={m.newsletter_ph_zip()} bind:value={$formData.zip} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<p class="text-sm text-muted-foreground">{m.newsletter_privacy()}</p>
			</Card.Content>

			<Card.Footer class="justify-between">
				<LanguageSwitch />
				<Form.Button>
					<CheckIcon />
					{m.common_save()}
				</Form.Button>
			</Card.Footer>
		</form>
	</Card.Root>
</div>

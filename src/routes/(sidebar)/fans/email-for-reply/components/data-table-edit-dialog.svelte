<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	const formSchema = z.object({
		email: z.string().email('Neplatná e-mailová adresa'),
	});

	type Email = { id: number; email: string; isActive: string };

	let {
		emailToEdit = $bindable(),
	}: {
		emailToEdit: Email | null;
	} = $props();

	const form = superForm(defaults(zod4(formSchema)), {
		validators: zod4(formSchema),
		SPA: true,
		onUpdated: ({ form }) => {
			if (form.valid && emailToEdit) {
				emailToEdit.email = form.data.email;
				emailToEdit = null;
			}
		},
	});

	const { form: formData, enhance } = form;

	// Při otevření dialogu naplní input aktuální hodnotou
	$effect(() => {
		if (emailToEdit) {
			$formData.email = emailToEdit.email;
		}
	});
</script>

<Dialog.Root
	open={emailToEdit !== null}
	onOpenChange={(open) => { if (!open) emailToEdit = null; }}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Editovat e-mail</Dialog.Title>
		</Dialog.Header>

		<form use:enhance>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>E-mail</Form.Label>
						<Input
							{...props}
							type="email"
							placeholder="email@example.com"
							bind:value={$formData.email}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Dialog.Footer class="mt-4">
				<Button variant="outline" type="button" onclick={() => emailToEdit = null}>
					Zrušit
				</Button>
				<Button type="submit">Uložit</Button>
			</Dialog.Footer>
		</form>

	</Dialog.Content>
</Dialog.Root>
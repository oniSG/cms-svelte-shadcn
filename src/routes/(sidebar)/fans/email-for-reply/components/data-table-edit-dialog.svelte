<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	import * as m from '$lib/paraglide/messages.js';

	const formSchema = z.object({
		email: z.string().email(m.reply_email_validation_invalid())
	});

	type Email = { id: number; email: string; isActive: string };
	let {
		emailToEdit = $bindable()
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
		}
	});

	const { form: formData, enhance } = form;

	$effect(() => {
		if (emailToEdit) {
			$formData.email = emailToEdit.email;
		}
	});
</script>

<Dialog.Root
	onOpenChange={(open) => { if (!open) emailToEdit = null; }}
	open={emailToEdit !== null}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{m.reply_email_dialog_edit_title()}</Dialog.Title>
		</Dialog.Header>
		<form use:enhance>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{m.login_email()}</Form.Label>
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
				<Button onclick={() => emailToEdit = null} type="button" variant="outline">
					{m.common_cancel()}
				</Button>
				<Button type="submit">{m.save()}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
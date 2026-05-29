<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	const formSchema = z.object({
		email: z.email('Neplatná e-mailová adresa')
	});

	let { open = $bindable() }: { open: boolean } = $props();

	const form = superForm(defaults(zod4(formSchema)), {
		validators: zod4(formSchema),
		SPA: true,
		onUpdated: ({ form }) => {
			if (form.valid) {
				open = false;
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Přidat e-mail</Dialog.Title>
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
				<Button
					onclick={() => (open = false)}
					type="button"
					variant="outline">
					Zrušit
				</Button>
				<Button
					type="submit">
					Přidat
				</Button>
			</Dialog.Footer>
		</form>

	</Dialog.Content>
</Dialog.Root>
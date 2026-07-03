<script lang="ts">
	import { untrack } from 'svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import RequiredMark from '$lib/components/custom/required-mark.svelte';
	import {
		allColors,
		colorClasses,
		colorLabels,
		makeTagFormSchema,
		TAG_LIMITS,
		type Tag,
		type TagColor,
		type TagFormValues
	} from '../tag';

	let {
		open = $bindable(false),
		tag,
		isNameTaken,
		onSave
	}: {
		open?: boolean;
		tag?: Tag;
		isNameTaken: (name: string) => boolean;
		onSave: (input: TagFormValues) => void;
	} = $props();

	const schema = makeTagFormSchema((name) => {
		if (tag && tag.name.trim().toLowerCase() === name.trim().toLowerCase()) return false;
		return isNameTaken(name);
	});

	const form = superForm(defaults(zod4(schema)), {
		SPA: true,
		validators: zod4Client(schema),
		resetForm: false,
		onUpdate: ({ form: f }) => {
			if (!f.valid) return;
			onSave({ ...f.data, name: f.data.name.trim() });
			open = false;
		}
	});

	const { form: formData, enhance, errors, tainted, submitting, reset } = form;

	$effect(() => {
		if (!open) return;
		const t = untrack(() => tag);
		reset({
			data: t
				? { name: t.name, color: t.color, active: t.active }
				: { name: '', color: 'slate', active: true }
		});
	});

	const isEdit = $derived(!!tag);
	const nameLen = $derived($formData.name.length);

	let colorOpen = $state(false);

	function pickColor(c: TagColor) {
		$formData.color = c;
		colorOpen = false;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="gap-0">
		<Sheet.Header>
			<Sheet.Title>{isEdit ? 'Edit tag' : 'Create tag'}</Sheet.Title>
			<Sheet.Description>
				{isEdit
					? 'Update the tag name, color, and active state.'
					: 'Add a new tag to categorize records.'}
			</Sheet.Description>
		</Sheet.Header>

		<form use:enhance class="flex min-h-0 flex-1 flex-col">
			<div class="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-2">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center justify-between">
								<Form.Label>Name<RequiredMark /></Form.Label>
								<span
									class="text-xs tabular-nums {nameLen > TAG_LIMITS.nameMax
										? 'text-destructive'
										: 'text-muted-foreground'}"
								>
									{nameLen}/{TAG_LIMITS.nameMax}
								</span>
							</div>
							<Input
								{...props}
								placeholder="Tag name"
								maxlength={TAG_LIMITS.nameMax}
								bind:value={$formData.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="color">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Color<RequiredMark /></Form.Label>
							<Popover.Root bind:open={colorOpen}>
								<Popover.Trigger>
									{#snippet child({ props: triggerProps })}
										<Button
											{...props}
											{...triggerProps}
											variant="outline"
											class="w-fit min-w-56 justify-start"
										>
											<Badge
												variant="outline"
												class="font-medium uppercase {colorClasses[$formData.color]}"
											>
												{colorLabels[$formData.color]}
											</Badge>
										</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-56 p-0" align="start">
									<Command.Root>
										<Command.List>
											<Command.Group heading="Color">
												{#each allColors as c (c)}
													<Command.Item
														value={colorLabels[c]}
														data-checked={$formData.color === c}
														onSelect={() => pickColor(c)}
													>
														<Badge
															variant="outline"
															class="font-medium uppercase {colorClasses[c]}"
														>
															{colorLabels[c]}
														</Badge>
													</Command.Item>
												{/each}
											</Command.Group>
										</Command.List>
									</Command.Root>
								</Popover.Content>
							</Popover.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="active">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center justify-between gap-4">
								<Form.Label>Active</Form.Label>
								<Switch {...props} bind:checked={$formData.active} />
							</div>
						{/snippet}
					</Form.Control>
					<Form.Description>Inactive tags are hidden from tagging surfaces.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				{#if $errors._errors && $errors._errors.length > 0}
					<div class="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
						{$errors._errors.join(' ')}
					</div>
				{/if}
			</div>

			<Sheet.Footer class="flex-row justify-end">
				<Sheet.Close type="button" class={buttonVariants({ variant: 'outline' })}>
					Cancel
				</Sheet.Close>
				<Button type="submit" disabled={$submitting || (isEdit && !$tainted)}>
					{isEdit ? 'Save changes' : 'Create tag'}
				</Button>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>

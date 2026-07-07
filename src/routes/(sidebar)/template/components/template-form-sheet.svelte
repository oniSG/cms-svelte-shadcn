<script lang="ts">
	import { untrack } from 'svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import XIcon from '@lucide/svelte/icons/x';
	import RequiredMark from '$lib/components/custom/required-mark.svelte';
	import { tagColorClass } from '$lib/components/custom/table-page';
	import {
		commonTemplateTags,
		makeTemplateFormSchema,
		TEMPLATE_LIMITS,
		type Template,
		type TemplateFormValues
	} from '../template';

	let {
		open = $bindable(false),
		template,
		isNameTaken,
		onSave
	}: {
		open?: boolean;
		template?: Template;
		isNameTaken: (name: string) => boolean;
		onSave: (input: TemplateFormValues) => void;
	} = $props();

	const schema = makeTemplateFormSchema((name) => {
		if (template && template.name.trim().toLowerCase() === name.trim().toLowerCase()) return false;
		return isNameTaken(name);
	});

	const form = superForm(defaults(zod4(schema)), {
		SPA: true,
		validators: zod4Client(schema),
		resetForm: false,
		onUpdate: ({ form: f }) => {
			if (!f.valid) return;
			onSave({
				...f.data,
				name: f.data.name.trim(),
				description: f.data.description.trim()
			});
			open = false;
		}
	});

	const { form: formData, enhance, errors, tainted, submitting, reset } = form;

	$effect(() => {
		if (!open) return;
		const t = untrack(() => template);
		reset({
			data: t
				? {
						name: t.name,
						description: t.description,
						tags: t.tags,
						active: t.active,
						auto_save: t.auto_save,
						auto_translate: t.auto_translate
					}
				: {
						name: '',
						description: '',
						tags: [],
						active: true,
						auto_save: false,
						auto_translate: false
					}
		});
	});

	const isEdit = $derived(!!template);
	const nameLen = $derived($formData.name.length);
	const descLen = $derived($formData.description.length);
	const tagsFull = $derived($formData.tags.length >= TEMPLATE_LIMITS.maxTags);

	let tagsOpen = $state(false);

	function toggleTag(t: string) {
		if ($formData.tags.includes(t)) {
			$formData.tags = $formData.tags.filter((x) => x !== t);
			return;
		}
		if (tagsFull) return;
		$formData.tags = [...$formData.tags, t];
	}

	function removeTag(t: string) {
		$formData.tags = $formData.tags.filter((x) => x !== t);
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="gap-0 sm:max-w-lg">
		<Sheet.Header>
			<Sheet.Title>{isEdit ? 'Edit template' : 'Create template'}</Sheet.Title>
			<Sheet.Description>
				{isEdit
					? 'Update the template details.'
					: 'Templates are reusable message layouts you can send to any audience.'}
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
									class="text-xs tabular-nums {nameLen > TEMPLATE_LIMITS.nameMax
										? 'text-destructive'
										: 'text-muted-foreground'}"
								>
									{nameLen}/{TEMPLATE_LIMITS.nameMax}
								</span>
							</div>
							<Input
								{...props}
								placeholder="Template name"
								maxlength={TEMPLATE_LIMITS.nameMax}
								bind:value={$formData.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center justify-between">
								<Form.Label>Description</Form.Label>
								<span
									class="text-xs tabular-nums {descLen > TEMPLATE_LIMITS.descriptionMax
										? 'text-destructive'
										: 'text-muted-foreground'}"
								>
									{descLen}/{TEMPLATE_LIMITS.descriptionMax}
								</span>
							</div>
							<Textarea
								{...props}
								placeholder="What is this template for?"
								maxlength={TEMPLATE_LIMITS.descriptionMax}
								rows={3}
								class="border-border bg-background"
								bind:value={$formData.description}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="tags">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center justify-between">
								<Form.Label>Tags</Form.Label>
								<span
									class="text-xs tabular-nums {tagsFull
										? 'text-destructive'
										: 'text-muted-foreground'}"
								>
									{$formData.tags.length}/{TEMPLATE_LIMITS.maxTags}
								</span>
							</div>
							<Popover.Root bind:open={tagsOpen}>
								<Popover.Trigger>
									{#snippet child({ props: triggerProps })}
										<div
											{...triggerProps}
											{...props}
											role="combobox"
											tabindex="0"
											aria-expanded={tagsOpen}
											onclick={() => (tagsOpen = true)}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													tagsOpen = true;
													return;
												}
												if (e.key === 'Backspace' && $formData.tags.length > 0) {
													e.preventDefault();
													removeTag($formData.tags[$formData.tags.length - 1]);
												}
											}}
											class="flex min-h-9 w-full cursor-text flex-wrap items-center gap-1 rounded-3xl border border-border bg-background px-2 py-1 text-sm transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
										>
											{#each $formData.tags as t (t)}
												<Badge variant="outline" class="gap-1 pr-1 font-medium {tagColorClass(t)}">
													{t}
													<button
														type="button"
														onclick={(e) => {
															e.stopPropagation();
															removeTag(t);
														}}
														class="flex size-4 items-center justify-center rounded-full hover:bg-muted-foreground/20"
														aria-label="Remove tag"
													>
														<XIcon class="size-3" />
													</button>
												</Badge>
											{/each}
											{#if $formData.tags.length === 0}
												<span class="px-1 text-muted-foreground">Add tags…</span>
											{/if}
										</div>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-(--bits-popover-anchor-width) p-0" align="start">
									<Command.Root>
										<Command.Input placeholder="Search tags…" />
										<Command.List>
											<Command.Empty>No tags found.</Command.Empty>
											<Command.Group heading="Tags">
												{#each commonTemplateTags as t (t)}
													{@const checked = $formData.tags.includes(t)}
													<Command.Item
														value={t}
														data-checked={checked}
														onSelect={() => toggleTag(t)}
													>
														<Badge variant="outline" class="font-medium {tagColorClass(t)}">
															{t}
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

				<div class="space-y-3">
					<Form.Field {form} name="active">
						<Form.Control>
							{#snippet children({ props })}
								<label class="flex items-center gap-2 text-sm">
									<Checkbox {...props} bind:checked={$formData.active} />
									<span>Active</span>
								</label>
							{/snippet}
						</Form.Control>
					</Form.Field>

					<Form.Field {form} name="auto_save">
						<Form.Control>
							{#snippet children({ props })}
								<label class="flex items-center gap-2 text-sm">
									<Checkbox {...props} bind:checked={$formData.auto_save} />
									<span>Automatic saving</span>
								</label>
							{/snippet}
						</Form.Control>
					</Form.Field>

					<Form.Field {form} name="auto_translate">
						<Form.Control>
							{#snippet children({ props })}
								<label class="flex items-center gap-2 text-sm text-muted-foreground">
									<Checkbox {...props} disabled bind:checked={$formData.auto_translate} />
									<span>Automatic template translation</span>
									<span class="text-xs">— temporarily unavailable</span>
								</label>
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>

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
					{isEdit ? 'Save changes' : 'Create template'}
				</Button>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>

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
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import XIcon from '@lucide/svelte/icons/x';
	import RequiredMark from '$lib/components/custom/required-mark.svelte';
	import { tagColorClass } from '$lib/components/custom/table-page';
	import {
		commonSegmentTags,
		makeSegmentFormSchema,
		SEGMENT_LIMITS,
		type Segment,
		type SegmentFormValues
	} from '../segment';

	let {
		open = $bindable(false),
		segment,
		isNameTaken,
		onSave
	}: {
		open?: boolean;
		segment?: Segment;
		isNameTaken: (name: string) => boolean;
		onSave: (input: SegmentFormValues) => void;
	} = $props();

	const schema = makeSegmentFormSchema((name) => {
		if (segment && segment.name.trim().toLowerCase() === name.trim().toLowerCase()) return false;
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
		const s = untrack(() => segment);
		reset({
			data: s
				? { name: s.name, description: s.description, tags: s.tags }
				: { name: '', description: '', tags: [] }
		});
	});

	const isEdit = $derived(!!segment);
	const nameLen = $derived($formData.name.length);
	const descLen = $derived($formData.description.length);
	const tagsFull = $derived($formData.tags.length >= SEGMENT_LIMITS.maxTags);

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
			<Sheet.Title>{isEdit ? 'Edit segment' : 'Create segment'}</Sheet.Title>
			<Sheet.Description>
				{isEdit
					? 'Update the segment name, description, and tags.'
					: 'A segment is a saved audience — a filtered set of visitors you can target.'}
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
									class="text-xs tabular-nums {nameLen > SEGMENT_LIMITS.nameMax
										? 'text-destructive'
										: 'text-muted-foreground'}"
								>
									{nameLen}/{SEGMENT_LIMITS.nameMax}
								</span>
							</div>
							<Input
								{...props}
								placeholder="Segment name"
								maxlength={SEGMENT_LIMITS.nameMax}
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
									class="text-xs tabular-nums {descLen > SEGMENT_LIMITS.descriptionMax
										? 'text-destructive'
										: 'text-muted-foreground'}"
								>
									{descLen}/{SEGMENT_LIMITS.descriptionMax}
								</span>
							</div>
							<Textarea
								{...props}
								placeholder="What is this segment for?"
								maxlength={SEGMENT_LIMITS.descriptionMax}
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
									{$formData.tags.length}/{SEGMENT_LIMITS.maxTags}
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
												{#each commonSegmentTags as t (t)}
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
					<Form.Description>
						Tags help group related segments — they don't affect who is in the segment.
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				{#if $errors._errors && $errors._errors.length > 0}
					<div class="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
						{$errors._errors.join(' ')}
					</div>
				{/if}
			</div>

			<p>TODO: Add the same condition logic as we have in advanced filtering. Denis Matsenko</p>

			<Sheet.Footer class="flex-row justify-end">
				<Sheet.Close type="button" class={buttonVariants({ variant: 'outline' })}>
					Cancel
				</Sheet.Close>
				<Button type="submit" disabled={$submitting || (isEdit && !$tainted)}>
					{isEdit ? 'Save changes' : 'Create segment'}
				</Button>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>

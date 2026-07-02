<script lang="ts">
	import { untrack } from 'svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import XIcon from '@lucide/svelte/icons/x';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import RequiredMark from '$lib/components/custom/required-mark.svelte';
	import {
		allFieldTypes,
		CA_LIMITS,
		fieldTypeLabels,
		makeCAFormSchema,
		type CAFormValues,
		type CustomAttrFieldType,
		type CustomAttribute
	} from '../custom-attribute';
	import { addSection, hasSection, removeSection, sectionsState } from '../sections.svelte.js';
	import { countBySection } from '../temp/data';

	let {
		open = $bindable(false),
		attr,
		isNameTaken,
		isApiKeyTaken,
		onSave
	}: {
		open?: boolean;
		attr?: CustomAttribute;
		isNameTaken: (name: string) => boolean;
		isApiKeyTaken: (apiKey: string) => boolean;
		onSave: (input: CAFormValues) => void;
	} = $props();

	function toApiKey(name: string): string {
		const cleaned = name
			.normalize('NFKD')
			.replace(/[^a-zA-Z0-9\s]+/g, '')
			.trim();
		if (!cleaned) return '';
		const parts = cleaned.split(/\s+/);
		const first = parts[0].toLowerCase();
		const rest = parts
			.slice(1)
			.map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
			.join('');
		return (first + rest).slice(0, CA_LIMITS.apiKeyMax);
	}

	const schema = makeCAFormSchema({
		isNameTaken: (name) => {
			if (attr && attr.name.trim().toLowerCase() === name.trim().toLowerCase()) return false;
			return isNameTaken(name);
		},
		isApiKeyTaken: (key) => {
			if (attr && attr.api_key.trim().toLowerCase() === key.trim().toLowerCase()) return false;
			return isApiKeyTaken(key);
		},
		isValidSection: (s) => hasSection(s)
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
				api_key: f.data.api_key.trim(),
				default_value: f.data.default_value.trim()
			});
			open = false;
		}
	});

	const { form: formData, enhance, errors, tainted, submitting, reset } = form;

	let apiKeyDirty = $state(false);
	let sectionOpen = $state(false);
	let sectionSearch = $state('');
	let fieldTypeOpen = $state(false);
	let newOption = $state('');

	$effect(() => {
		if (!open) return;
		const t = untrack(() => attr);
		apiKeyDirty = !!t;
		newOption = '';
		sectionSearch = '';
		reset({
			data: t
				? {
						name: t.name,
						api_key: t.api_key,
						section: t.section,
						field_type: t.field_type,
						options: t.options ?? [],
						default_value: t.default_value ?? '',
						active: t.active,
						all_clubs: t.all_clubs
					}
				: {
						name: '',
						api_key: '',
						section: sectionsState.list[0] ?? '',
						field_type: 'TEXT',
						options: [],
						default_value: '',
						active: true,
						all_clubs: false
					}
		});
	});

	// Auto-derive api_key from name until user manually edits api_key
	$effect(() => {
		if (!open || apiKeyDirty) return;
		const derived = toApiKey($formData.name);
		if ($formData.api_key !== derived) $formData.api_key = derived;
	});

	const isEdit = $derived(!!attr);
	const nameLen = $derived($formData.name.length);
	const apiKeyLen = $derived($formData.api_key.length);
	const isSelect = $derived($formData.field_type === 'SELECT');
	const optionsFull = $derived($formData.options.length >= CA_LIMITS.maxOptions);

	const filteredSections = $derived.by(() => {
		const q = sectionSearch.trim().toLowerCase();
		if (!q) return sectionsState.list;
		return sectionsState.list.filter((s) => s.toLowerCase().includes(q));
	});

	const canCreateSection = $derived.by(() => {
		const q = sectionSearch.trim();
		if (!q) return false;
		if (q.length < CA_LIMITS.sectionMin || q.length > CA_LIMITS.sectionMax) return false;
		return !sectionsState.list.some((s) => s.toLowerCase() === q.toLowerCase());
	});

	const defaultPlaceholder = $derived.by(() => {
		switch ($formData.field_type) {
			case 'CHECKBOX':
				return 'true or false';
			case 'DATE':
				return 'YYYY-MM-DD';
			case 'NUMBER':
				return '0';
			case 'IMAGE_URL':
				return 'https://…';
			case 'INTEGRATION':
				return 'integration id';
			case 'SELECT':
				return 'Must match one of the options';
			default:
				return 'Optional default value';
		}
	});

	function pickSection(s: string) {
		$formData.section = s;
		sectionSearch = '';
		sectionOpen = false;
	}

	function createAndPickSection() {
		const created = addSection(sectionSearch);
		if (!created) return;
		pickSection(created);
		toast.success(`Section "${created}" created`);
	}

	function tryRemoveSection(s: string) {
		const inUse = countBySection(s);
		if (inUse > 0) {
			toast.error(`Can't remove "${s}" — used by ${inUse} field${inUse === 1 ? '' : 's'}`);
			return;
		}
		removeSection(s);
		if ($formData.section === s) $formData.section = sectionsState.list[0] ?? '';
		toast.success(`Section "${s}" removed`);
	}

	function pickFieldType(t: CustomAttrFieldType) {
		const prev = $formData.field_type;
		if (prev === t) {
			fieldTypeOpen = false;
			return;
		}
		$formData.field_type = t;
		if (prev === 'SELECT' && t !== 'SELECT') $formData.options = [];
		$formData.default_value = '';
		fieldTypeOpen = false;
	}

	function addOption() {
		const val = newOption.trim();
		if (!val) return;
		if (val.length > CA_LIMITS.optionMax) return;
		if (optionsFull) return;
		if ($formData.options.some((o) => o.toLowerCase() === val.toLowerCase())) {
			newOption = '';
			return;
		}
		$formData.options = [...$formData.options, val];
		newOption = '';
	}

	function removeOption(i: number) {
		$formData.options = $formData.options.filter((_, idx) => idx !== i);
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content class="gap-0 sm:max-w-lg">
		<Sheet.Header>
			<Sheet.Title>{isEdit ? 'Edit custom field' : 'Create custom field'}</Sheet.Title>
			<Sheet.Description>
				{isEdit ? 'Update the field configuration.' : 'Add a new custom field to visitor records.'}
			</Sheet.Description>
		</Sheet.Header>

		<form use:enhance class="flex min-h-0 flex-1 flex-col">
			<div class="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-2">
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center justify-between">
								<Form.Label>Field name<RequiredMark /></Form.Label>
								<span
									class="text-xs tabular-nums {nameLen > CA_LIMITS.nameMax
										? 'text-destructive'
										: 'text-muted-foreground'}"
								>
									{nameLen}/{CA_LIMITS.nameMax}
								</span>
							</div>
							<Input
								{...props}
								placeholder="medicalRecords"
								maxlength={CA_LIMITS.nameMax}
								bind:value={$formData.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="api_key">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center justify-between">
								<Form.Label>API key<RequiredMark /></Form.Label>
								<span
									class="text-xs tabular-nums {apiKeyLen > CA_LIMITS.apiKeyMax
										? 'text-destructive'
										: 'text-muted-foreground'}"
								>
									{apiKeyLen}/{CA_LIMITS.apiKeyMax}
								</span>
							</div>
							<Input
								{...props}
								class="font-mono"
								placeholder="medicalRecords"
								maxlength={CA_LIMITS.apiKeyMax}
								bind:value={$formData.api_key}
								oninput={() => (apiKeyDirty = true)}
							/>
						{/snippet}
					</Form.Control>
					<Form.Description>
						{apiKeyDirty ? 'Manually edited.' : 'Auto-derived from the field name.'}
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="section">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Section<RequiredMark /></Form.Label>
							<Popover.Root bind:open={sectionOpen}>
								<Popover.Trigger>
									{#snippet child({ props: triggerProps })}
										<Button
											{...props}
											{...triggerProps}
											variant="outline"
											class="w-full justify-between font-normal"
										>
											<span class:text-muted-foreground={!$formData.section}>
												{$formData.section || 'Select or create a section'}
											</span>
											<ChevronDownIcon class="size-4 opacity-50" />
										</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-(--bits-popover-anchor-width) p-0" align="start">
									<Command.Root shouldFilter={false}>
										<Command.Input
											bind:value={sectionSearch}
											placeholder="Search or type a new section…"
											maxlength={CA_LIMITS.sectionMax}
										/>
										<Command.List>
											{#if filteredSections.length > 0}
												<Command.Group heading="Sections">
													{#each filteredSections as s (s)}
														<Command.Item
															value={s}
															data-checked={$formData.section === s}
															onSelect={() => pickSection(s)}
															class="pr-2"
														>
															<span class="flex-1 truncate">{s}</span>
															<button
																type="button"
																aria-label={`Remove ${s}`}
																onclick={(e) => {
																	e.stopPropagation();
																	tryRemoveSection(s);
																}}
																class="ml-2 flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
															>
																<Trash2Icon class="size-3.5" />
															</button>
														</Command.Item>
													{/each}
												</Command.Group>
											{:else if !canCreateSection}
												<Command.Empty>
													{sectionSearch.trim()
														? 'That section name is too short or too long.'
														: 'No sections yet — type a name to create one.'}
												</Command.Empty>
											{/if}
											{#if canCreateSection}
												{#if filteredSections.length > 0}
													<Command.Separator />
												{/if}
												<Command.Group>
													<Command.Item
														value={`__create__${sectionSearch}`}
														onSelect={createAndPickSection}
														class="text-primary"
													>
														<PlusIcon class="size-4" />
														<span>Create "{sectionSearch.trim()}"</span>
													</Command.Item>
												</Command.Group>
											{/if}
										</Command.List>
									</Command.Root>
								</Popover.Content>
							</Popover.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="field_type">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Field type<RequiredMark /></Form.Label>
							<Popover.Root bind:open={fieldTypeOpen}>
								<Popover.Trigger>
									{#snippet child({ props: triggerProps })}
										<Button
											{...props}
											{...triggerProps}
											variant="outline"
											class="w-full justify-between font-normal"
										>
											<span>{fieldTypeLabels[$formData.field_type]}</span>
											<ChevronDownIcon class="size-4 opacity-50" />
										</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-(--bits-popover-anchor-width) p-0" align="start">
									<Command.Root>
										<Command.List>
											<Command.Group heading="Field type">
												{#each allFieldTypes as t (t)}
													<Command.Item
														value={fieldTypeLabels[t]}
														data-checked={$formData.field_type === t}
														onSelect={() => pickFieldType(t)}
													>
														{fieldTypeLabels[t]}
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

				{#if isSelect}
					<Form.Field {form} name="options">
						<Form.Control>
							{#snippet children({ props })}
								<div class="flex items-center justify-between">
									<Form.Label>Options<RequiredMark /></Form.Label>
									<span
										class="text-xs tabular-nums {optionsFull
											? 'text-destructive'
											: 'text-muted-foreground'}"
									>
										{$formData.options.length}/{CA_LIMITS.maxOptions}
									</span>
								</div>
								<div class="space-y-3" {...props}>
									{#if $formData.options.length > 0}
										<div class="flex flex-wrap gap-1.5">
											{#each $formData.options as opt, i (i)}
												<Badge variant="secondary" class="gap-1 pr-1">
													{opt}
													<button
														type="button"
														onclick={() => removeOption(i)}
														class="flex size-4 items-center justify-center rounded-full hover:bg-muted-foreground/20"
														aria-label="Remove option"
													>
														<XIcon class="size-3" />
													</button>
												</Badge>
											{/each}
										</div>
									{/if}
									<div class="flex gap-2">
										<Input
											placeholder="Add an option"
											bind:value={newOption}
											maxlength={CA_LIMITS.optionMax}
											disabled={optionsFull}
											onkeydown={(e) => {
												if (e.key === 'Enter') {
													e.preventDefault();
													addOption();
												}
											}}
										/>
										<Button
											type="button"
											variant="secondary"
											onclick={addOption}
											disabled={!newOption.trim() || optionsFull}
										>
											<PlusIcon />
											Add
										</Button>
									</div>
								</div>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				{/if}

				<Form.Field {form} name="default_value">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Default value</Form.Label>
							<Input
								{...props}
								placeholder={defaultPlaceholder}
								maxlength={CA_LIMITS.defaultValueMax}
								bind:value={$formData.default_value}
							/>
						{/snippet}
					</Form.Control>
					<Form.Description>Optional. Leave blank for no default.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="all_clubs">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex items-center justify-between gap-4">
								<Form.Label>All clubs</Form.Label>
								<Switch {...props} bind:checked={$formData.all_clubs} />
							</div>
						{/snippet}
					</Form.Control>
					<Form.Description>Make the field available across every club.</Form.Description>
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
					<Form.Description>Inactive fields are hidden from record surfaces.</Form.Description>
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
					{isEdit ? 'Save changes' : 'Create field'}
				</Button>
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>

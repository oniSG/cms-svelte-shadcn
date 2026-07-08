<script lang="ts">
	import { untrack } from 'svelte';
	import { defaults, superForm, numberProxy } from 'sveltekit-superforms';
	import { zod4, zod4Client } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import XIcon from '@lucide/svelte/icons/x';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { PencilIcon } from '@lucide/svelte';
	import MoreHorizontalIcon from '@lucide/svelte/icons/more-horizontal';
	import RequiredMark from '$lib/components/custom/required-mark.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import {
		allFieldTypes,
		BASE_FIELD_ELIGIBLE_TYPES,
		CA_LIMITS,
		fieldTypeLabels,
		fieldTypeIcons,
		makeCAFormSchema,
		mockApiIntegrations,
		mockBaseFields,
		VALIDATION_ELIGIBLE_TYPES,
		type ApiIntegration,
		type CAFormValues,
		type CustomAttrFieldType,
		type CustomAttribute
	} from '../custom-attribute';
	import { addGroup, groupsState, hasGroup } from '../groups.svelte.js';

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
		isValidGroup: (s) => hasGroup(s)
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

	const maxLengthProxy = numberProxy(form, 'max_length', { empty: 'undefined' });
	const maxNumberProxy = numberProxy(form, 'max_number', { empty: 'undefined' });
	const maxUrlLengthProxy = numberProxy(form, 'max_url_length', { empty: 'undefined' });

	let apiKeyDirty = $state(false);
	let groupOpen = $state(false);
	let groupSearch = $state('');
	let fieldTypeOpen = $state(false);
	let newOption = $state('');
	let imagePreviewError = $state(false);
	let baseFieldOpen = $state(false);
	let baseFieldSearch = $state('');

	$effect(() => {
		if (!open) return;
		const t = untrack(() => attr);
		apiKeyDirty = !!t;
		newOption = '';
		groupSearch = '';
		baseFieldSearch = '';
		reset({
			data: t
				? {
						name: t.name,
						api_key: t.api_key,
						group: t.group,
						field_type: t.field_type,
						options: t.options ?? [],
						default_value: t.default_value ?? '',
						connected_base_field: t.connected_base_field ?? '',
						required: t.required,
						error_message: t.error_message ?? '',
						max_length: t.max_length ?? undefined,
						max_number: t.max_number ?? undefined,
						max_url_length: t.max_url_length ?? undefined,
						allow_array: t.allow_array,
						allow_object: t.allow_object,
						active: t.active,
						all_clubs: t.all_clubs,
						expected_structure: t.expected_structure ?? ''
					}
				: {
						name: '',
						api_key: '',
						group: groupsState.list[0] ?? '',
						field_type: 'TEXT',
						options: [],
						default_value: '',
						connected_base_field: '',
						required: false,
						error_message: '',
						max_length: undefined,
						max_number: undefined,
						max_url_length: undefined,
						allow_array: false,
						allow_object: false,
						active: true,
						all_clubs: false,
						expected_structure: ''
					}
		});
	});

	// Auto-derive api_key from name until user manually edits api_key
	$effect(() => {
		if (!open || apiKeyDirty) return;
		const derived = toApiKey($formData.name);
		if ($formData.api_key !== derived) $formData.api_key = derived;
	});

	$effect(() => {
		trimmedImageUrl;
		imagePreviewError = false;
	});

	const isEdit = $derived(!!attr);
	const nameLen = $derived($formData.name.length);
	const apiKeyLen = $derived($formData.api_key.length);
	const isSelect = $derived($formData.field_type === 'SELECT');
	const optionsFull = $derived($formData.options.length >= CA_LIMITS.maxOptions);

	const filteredGroups = $derived.by(() => {
		const q = groupSearch.trim().toLowerCase();
		if (!q) return groupsState.list;
		return groupsState.list.filter((s) => s.toLowerCase().includes(q));
	});

	const canCreateGroup = $derived.by(() => {
		const q = groupSearch.trim();
		if (!q) return false;
		if (q.length < CA_LIMITS.groupMin || q.length > CA_LIMITS.groupMax) return false;
		return !groupsState.list.some((s) => s.toLowerCase() === q.toLowerCase());
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

	const isImageUrl = $derived($formData.field_type === 'IMAGE_URL');
	const trimmedImageUrl = $derived($formData.default_value.trim());
	const showImagePreview = $derived(isImageUrl && trimmedImageUrl.length > 0);

	const showBaseField = $derived(BASE_FIELD_ELIGIBLE_TYPES.includes($formData.field_type));
	const showValidation = $derived(VALIDATION_ELIGIBLE_TYPES.includes($formData.field_type));
	const isIntegration = $derived($formData.field_type === 'INTEGRATION');
	const showMaxLength = $derived(
		$formData.field_type === 'TEXT' ||
			$formData.field_type === 'LONG_TEXT' ||
			$formData.field_type === 'INTEGRATION'
	);
	const showMaxNumber = $derived($formData.field_type === 'NUMBER');
	const showMaxUrlLength = $derived($formData.field_type === 'IMAGE_URL');

	const filteredBaseFields = $derived.by(() => {
		const q = baseFieldSearch.trim().toLowerCase();
		if (!q) return mockBaseFields;
		return mockBaseFields.filter(
			(f) => f.label.toLowerCase().includes(q) || f.value.toLowerCase().includes(q)
		);
	});

	const selectedBaseField = $derived(
		mockBaseFields.find((f) => f.value === $formData.connected_base_field)
	);

	function pickGroup(s: string) {
		$formData.group = s;
		groupSearch = '';
		groupOpen = false;
	}

	function createAndPickGroup() {
		const created = addGroup(groupSearch);
		if (!created) return;
		pickGroup(created);
		toast.success(`Group "${created}" created`);
	}

	function pickFieldType(t: CustomAttrFieldType) {
		const prev = $formData.field_type;
		if (prev === t) {
			fieldTypeOpen = false;
			return;
		}
		$formData.field_type = t;
		if (prev === 'SELECT' && t !== 'SELECT') $formData.options = [];
		if (!BASE_FIELD_ELIGIBLE_TYPES.includes(t)) $formData.connected_base_field = '';
		if (!VALIDATION_ELIGIBLE_TYPES.includes(t)) {
			$formData.required = false;
			$formData.error_message = '';
		}
		if (t !== 'TEXT' && t !== 'LONG_TEXT' && t !== 'INTEGRATION') $formData.max_length = undefined;
		if (t !== 'NUMBER') $formData.max_number = undefined;
		if (t !== 'IMAGE_URL') $formData.max_url_length = undefined;
		if (t !== 'INTEGRATION') {
			$formData.allow_array = false;
			$formData.allow_object = false;
			$formData.expected_structure = '';
		}
		$formData.default_value = '';
		imagePreviewError = false;
		fieldTypeOpen = false;
	}

	function pickBaseField(value: string) {
		$formData.connected_base_field = value;
		baseFieldSearch = '';
		baseFieldOpen = false;
	}

	function clearBaseField() {
		$formData.connected_base_field = '';
		baseFieldOpen = false;
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

	function openEditIntegration(integration: ApiIntegration) {
		toast.info(`Edit clicked: ${integration.id}`);
	}

	function openDeleteIntegration(integration: ApiIntegration) {
		toast.info(`Delete clicked: ${integration.id}`);
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

				<Form.Field {form} name="group">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Group<RequiredMark /></Form.Label>
							<Popover.Root bind:open={groupOpen}>
								<Popover.Trigger>
									{#snippet child({ props: triggerProps })}
										<Button
											{...props}
											{...triggerProps}
											variant="outline"
											class="w-full justify-between font-normal"
										>
											<span class:text-muted-foreground={!$formData.group}>
												{$formData.group || 'Select or create a group'}
											</span>
											<ChevronDownIcon class="size-4 opacity-50" />
										</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-(--bits-popover-anchor-width) p-0" align="start">
									<Command.Root shouldFilter={false}>
										<Command.Input
											bind:value={groupSearch}
											placeholder="Search or type a new group…"
											maxlength={CA_LIMITS.groupMax}
										/>
										<Command.List>
											{#if filteredGroups.length > 0}
												<Command.Group heading="Groups">
													{#each filteredGroups as s (s)}
														<Command.Item
															value={s}
															data-checked={$formData.group === s}
															onSelect={() => pickGroup(s)}
														>
															<span class="flex-1 truncate">{s}</span>
														</Command.Item>
													{/each}
												</Command.Group>
											{:else if !canCreateGroup}
												<Command.Empty>
													{groupSearch.trim()
														? 'That group name is too short or too long.'
														: 'No groups yet — type a name to create one.'}
												</Command.Empty>
											{/if}
											{#if canCreateGroup}
												{#if filteredGroups.length > 0}
													<Command.Separator />
												{/if}
												<Command.Group>
													<Command.Item
														value={`__create__${groupSearch}`}
														onSelect={createAndPickGroup}
														class="text-primary"
													>
														<PlusIcon class="size-4" />
														<span>Create "{groupSearch.trim()}"</span>
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
										{@const CurrentIcon = fieldTypeIcons[$formData.field_type]}
										<Button
											{...props}
											{...triggerProps}
											variant="outline"
											class="w-full justify-between font-normal"
										>
											<span class="flex items-center gap-2">
												<CurrentIcon class="size-4 text-muted-foreground" />
												{fieldTypeLabels[$formData.field_type]}
											</span>
											<ChevronDownIcon class="size-4 opacity-50" />
										</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-(--bits-popover-anchor-width) p-0" align="start">
									<Command.Root>
										<Command.List>
											<Command.Group heading="Field type">
												{#each allFieldTypes as t (t)}
													{@const Icon = fieldTypeIcons[t]}
													<Command.Item
														value={fieldTypeLabels[t]}
														data-checked={$formData.field_type === t}
														onSelect={() => pickFieldType(t)}
														class="gap-2"
													>
														<Icon class="size-4 text-muted-foreground" />
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

				{#if showBaseField}
					<Form.Field {form} name="connected_base_field">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Connected base field</Form.Label>
								<Popover.Root bind:open={baseFieldOpen}>
									<Popover.Trigger>
										{#snippet child({ props: triggerProps })}
											<Button
												{...props}
												{...triggerProps}
												variant="outline"
												class="w-full justify-between font-normal"
											>
												<span class:text-muted-foreground={!selectedBaseField}>
													{selectedBaseField ? selectedBaseField.label : 'None'}
												</span>
												<span class="flex items-center gap-1">
													{#if selectedBaseField}
														<button
															type="button"
															aria-label="Clear selection"
															onclick={(e) => {
																e.stopPropagation();
																clearBaseField();
															}}
															class="flex size-5 items-center justify-center rounded-full hover:bg-muted-foreground/20"
														>
															<XIcon class="size-3.5" />
														</button>
													{/if}
													<ChevronDownIcon class="size-4 opacity-50" />
												</span>
											</Button>
										{/snippet}
									</Popover.Trigger>
									<Popover.Content class="w-(--bits-popover-anchor-width) p-0" align="start">
										<Command.Root shouldFilter={false}>
											<Command.Input
												bind:value={baseFieldSearch}
												placeholder="Search base fields…"
											/>
											<Command.List>
												{#if filteredBaseFields.length > 0}
													<Command.Group heading="Base fields">
														{#each filteredBaseFields as f (f.value)}
															<Command.Item
																value={f.label}
																data-checked={$formData.connected_base_field === f.value}
																onSelect={() => pickBaseField(f.value)}
															>
																{f.label}
															</Command.Item>
														{/each}
													</Command.Group>
												{:else}
													<Command.Empty>No matching base fields.</Command.Empty>
												{/if}
											</Command.List>
										</Command.Root>
									</Popover.Content>
								</Popover.Root>
							{/snippet}
						</Form.Control>
						<Form.Description>
							Optional. Link this field to an existing base record field.
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
				{/if}

				{#if showValidation}
					<div class="space-y-4 rounded-2xl border p-4">
						<p class="text-sm font-medium">Validation</p>

						<Form.Field {form} name="required">
							<Form.Control>
								{#snippet children({ props })}
									<div class="flex items-center justify-between gap-4">
										<Form.Label>Required</Form.Label>
										<Switch {...props} bind:checked={$formData.required} />
									</div>
								{/snippet}
							</Form.Control>
							<Form.Description>Is this field required?</Form.Description>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="error_message">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Error message</Form.Label>
									<Input
										{...props}
										placeholder="This field is required"
										maxlength={CA_LIMITS.errorMessageMax}
										bind:value={$formData.error_message}
									/>
								{/snippet}
							</Form.Control>
							<Form.Description
								>Message shown if the user does not fill in the field.</Form.Description
							>
							<Form.FieldErrors />
						</Form.Field>

						{#if showMaxLength}
							<Form.Field {form} name="max_length">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Maximum characters</Form.Label>
										<Input
											{...props}
											type="number"
											inputmode="numeric"
											min="1"
											placeholder="No limit"
											bind:value={$maxLengthProxy}
										/>
									{/snippet}
								</Form.Control>
								<Form.Description>Optional. Leave blank for no limit.</Form.Description>
								<Form.FieldErrors />
							</Form.Field>
						{/if}

						{#if showMaxNumber}
							<Form.Field {form} name="max_number">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Maximum number</Form.Label>
										<Input
											{...props}
											type="number"
											inputmode="decimal"
											placeholder="No limit"
											bind:value={$maxNumberProxy}
										/>
									{/snippet}
								</Form.Control>
								<Form.Description>Optional. Leave blank for no limit.</Form.Description>
								<Form.FieldErrors />
							</Form.Field>
						{/if}

						{#if showMaxUrlLength}
							<Form.Field {form} name="max_url_length">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Maximum URL length</Form.Label>
										<Input
											{...props}
											type="number"
											inputmode="numeric"
											min="1"
											placeholder="No limit"
											bind:value={$maxUrlLengthProxy}
										/>
									{/snippet}
								</Form.Control>
								<Form.Description>Optional. Leave blank for no limit.</Form.Description>
								<Form.FieldErrors />
							</Form.Field>
						{/if}
					</div>
				{/if}

				{#if isIntegration}
					<div class="space-y-4 rounded-2xl border p-4">
						<p class="text-sm font-medium">Integration options</p>

						<Form.Field {form} name="expected_structure">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Expected Structure (JSON)</Form.Label>
									<Textarea
										{...props}
										rows={4}
										placeholder={`{"type": "object", "properties": {"id": {"type": "number"}, "originFileName": {"type": "string"}}}`}
										maxlength={CA_LIMITS.expectedStructureMax}
										bind:value={$formData.expected_structure}
									/>
								{/snippet}
							</Form.Control>
							<Form.Description
								>Optional. Describe the expected JSON shape for reference — not validated.</Form.Description
							>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="allow_array">
							<Form.Control>
								{#snippet children({ props })}
									<div class="flex items-center justify-between gap-4">
										<Form.Label>Allow array</Form.Label>
										<Switch {...props} bind:checked={$formData.allow_array} />
									</div>
								{/snippet}
							</Form.Control>
							<Form.Description>Allow this field to store a list of values.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="allow_object">
							<Form.Control>
								{#snippet children({ props })}
									<div class="flex items-center justify-between gap-4">
										<Form.Label>Allow object</Form.Label>
										<Switch {...props} bind:checked={$formData.allow_object} />
									</div>
								{/snippet}
							</Form.Control>
							<Form.Description>Allow this field to store a nested object.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field {form} name="max_length">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Maximum length</Form.Label>
									<Input
										{...props}
										type="number"
										inputmode="numeric"
										min="1"
										placeholder="No limit"
										bind:value={$maxLengthProxy}
									/>
								{/snippet}
							</Form.Control>
							<Form.Description>Optional. Leave blank for no limit.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div class="space-y-4 rounded-2xl border p-4">
						<div class="flex items-center justify-between">
							<p class="text-sm font-medium">API integrations</p>
							<Button size="icon" variant="outline" class="size-7">
								<PlusIcon class="size-4" />
							</Button>
						</div>
						<div class="space-y-2">
							{#each mockApiIntegrations as integration (integration.id)}
								<div
									class="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2 text-sm"
								>
									<Badge variant="secondary" class="font-mono">{integration.method}</Badge>
									<span class="flex-1 truncate font-mono text-xs">{integration.endpoint}</span>
									<DropdownMenu.Root>
										<DropdownMenu.Trigger>
											{#snippet child({ props })}
												<Button {...props} size="icon" variant="ghost" class="size-7 shrink-0">
													<MoreHorizontalIcon class="size-4" />
												</Button>
											{/snippet}
										</DropdownMenu.Trigger>
										<DropdownMenu.Content align="end">
											<DropdownMenu.Item onSelect={() => openEditIntegration(integration)}>
												<PencilIcon />
												Edit
											</DropdownMenu.Item>
											<DropdownMenu.Separator />
											<DropdownMenu.Item
												onSelect={() => openDeleteIntegration(integration)}
												class="text-destructive focus:text-destructive"
											>
												<Trash2Icon />
												Delete
											</DropdownMenu.Item>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								</div>
							{/each}
						</div>
					</div>
				{/if}

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

				<Form.Field {form} name="default_value" class="flex items-start gap-3">
					<div class="min-w-0 flex-1">
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
					</div>

					{#if showImagePreview}
						<div
							class="mt-6 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted"
						>
							{#if imagePreviewError}
								<span class="px-2 text-center text-xs text-muted-foreground">
									Couldn't load image
								</span>
							{:else}
								<img
									src={trimmedImageUrl}
									alt="Default value preview"
									class="size-full object-cover"
									onerror={() => (imagePreviewError = true)}
								/>
							{/if}
						</div>
					{/if}
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

<script lang="ts">
	import { tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import CheckIcon from '@lucide/svelte/icons/check';
	import XIcon from '@lucide/svelte/icons/x';
	import LockIcon from '@lucide/svelte/icons/lock';
	import DeleteDialog from '$lib/components/custom/delete-dialog.svelte';
	import { CA_LIMITS } from '../custom-attribute';
	import { addGroup, groupsState, hasGroup, removeGroup, renameGroup } from '../groups.svelte.js';
	import { countByGroup, renameGroupInData } from '../temp/data';

	let {
		open = $bindable(false),
		onChange
	}: {
		open?: boolean;
		onChange?: () => void;
	} = $props();

	let newName = $state('');
	const newTrimmed = $derived(newName.trim());
	const newLen = $derived(newName.length);
	const newError = $derived.by(() => {
		if (!newTrimmed) return null;
		if (newTrimmed.length < CA_LIMITS.groupMin) return `At least ${CA_LIMITS.groupMin} characters`;
		if (newTrimmed.length > CA_LIMITS.groupMax) return `At most ${CA_LIMITS.groupMax} characters`;
		if (hasGroup(newTrimmed)) return 'A group with this name already exists';
		return null;
	});
	const canCreate = $derived(!!newTrimmed && !newError);

	function handleCreate() {
		if (!canCreate) return;
		const created = addGroup(newTrimmed);
		if (!created) return;
		newName = '';
		toast.success(`Group "${created}" created`);
	}

	let editing = $state<string | null>(null);
	let editValue = $state('');
	let editInputEl = $state<HTMLInputElement | null>(null);
	const editTrimmed = $derived(editValue.trim());
	const editError = $derived.by(() => {
		if (editing === null) return null;
		if (!editTrimmed) return 'Name is required';
		if (editTrimmed.length < CA_LIMITS.groupMin) return `At least ${CA_LIMITS.groupMin} characters`;
		if (editTrimmed.length > CA_LIMITS.groupMax) return `At most ${CA_LIMITS.groupMax} characters`;
		if (editTrimmed.toLowerCase() === editing.toLowerCase()) return null;
		if (hasGroup(editTrimmed)) return 'A group with this name already exists';
		return null;
	});

	async function startEdit(s: string) {
		if (editing !== null) return;
		editing = s;
		editValue = s;
		await tick();
		editInputEl?.focus();
		editInputEl?.select();
	}

	function cancelEdit() {
		editing = null;
		editValue = '';
	}

	function saveEdit() {
		if (editing === null || editError) return;
		if (editTrimmed === editing) {
			cancelEdit();
			return;
		}
		const from = editing;
		const to = editTrimmed;
		if (!renameGroup(from, to)) return;
		const moved = renameGroupInData(from, to);
		cancelEdit();
		onChange?.();
		const suffix = moved > 0 ? ` — ${moved} field${moved === 1 ? '' : 's'} moved` : '';
		toast.success(`Renamed to "${to}"${suffix}`);
	}

	let deleteTarget = $state<string | null>(null);
	let deleteOpen = $state(false);
	const deleteCount = $derived(deleteTarget ? countByGroup(deleteTarget) : 0);

	function askDelete(s: string) {
		deleteTarget = s;
		deleteOpen = true;
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		const name = deleteTarget;
		removeGroup(name);
		deleteTarget = null;
		onChange?.();
		toast.success(`Group "${name}" removed`);
	}

	function handleOpenChange(next: boolean) {
		if (!next) {
			newName = '';
			editing = null;
			editValue = '';
		}
	}
</script>

<Sheet.Root bind:open onOpenChange={handleOpenChange}>
	<Sheet.Content class="gap-0 sm:max-w-lg">
		<Sheet.Header>
			<Sheet.Title>Manage groups</Sheet.Title>
			<Sheet.Description>
				Groups organize custom fields on record surfaces. Rename, remove, or add new ones.
			</Sheet.Description>
		</Sheet.Header>

		<div class="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-2">
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<label for="ca-new-group" class="text-sm font-medium">New group</label>
					<span
						class="text-xs tabular-nums {newLen > CA_LIMITS.groupMax
							? 'text-destructive'
							: 'text-muted-foreground'}"
					>
						{newLen}/{CA_LIMITS.groupMax}
					</span>
				</div>
				<div class="flex gap-2">
					<Input
						id="ca-new-group"
						placeholder="e.g. Preferences"
						bind:value={newName}
						maxlength={CA_LIMITS.groupMax}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								handleCreate();
							}
						}}
					/>
					<Button variant="secondary" onclick={handleCreate} disabled={!canCreate}>
						<PlusIcon />
						Add
					</Button>
				</div>
				{#if newError}
					<p class="text-xs text-destructive">{newError}</p>
				{/if}
			</div>

			<Separator />

			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium">Existing groups</span>
					<span class="text-xs text-muted-foreground tabular-nums">
						{groupsState.list.length} total
					</span>
				</div>

				{#if groupsState.list.length === 0}
					<div
						class="rounded-2xl border border-dashed py-8 text-center text-sm text-muted-foreground"
					>
						No groups yet — create one above.
					</div>
				{:else}
					<ul class="divide-y overflow-hidden rounded-2xl border">
						{#each groupsState.list as s (s)}
							{@const isEditing = editing === s}
							{@const linked = countByGroup(s)}
							{@const isLast = groupsState.list.length === 1}
							<li class="flex items-center gap-2 px-3 py-2 transition-colors hover:bg-muted/40">
								{#if isEditing}
									<Input
										bind:ref={editInputEl}
										bind:value={editValue}
										maxlength={CA_LIMITS.groupMax}
										class="h-8"
										aria-invalid={!!editError}
										onkeydown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												saveEdit();
											} else if (e.key === 'Escape') {
												e.preventDefault();
												cancelEdit();
											}
										}}
									/>
									<Tooltip.Root>
										<Tooltip.Trigger>
											{#snippet child({ props })}
												<Button
													{...props}
													size="icon-sm"
													variant="ghost"
													class="text-primary"
													onclick={saveEdit}
													disabled={!!editError}
													aria-label="Save"
												>
													<CheckIcon />
												</Button>
											{/snippet}
										</Tooltip.Trigger>
										<Tooltip.Content>
											{editError ?? 'Save'}
										</Tooltip.Content>
									</Tooltip.Root>
									<Button size="icon-sm" variant="ghost" onclick={cancelEdit} aria-label="Cancel">
										<XIcon />
									</Button>
								{:else}
									<FolderIcon class="size-4 shrink-0 text-muted-foreground" />
									<span class="flex-1 truncate text-sm">{s}</span>
									{#if linked > 0}
										<Badge variant="secondary" class="font-normal tabular-nums">
											{linked} linked
										</Badge>
									{:else}
										<Badge variant="outline" class="font-normal text-muted-foreground">
											Not used
										</Badge>
									{/if}
									<Button
										size="icon-sm"
										variant="ghost"
										onclick={() => startEdit(s)}
										disabled={editing !== null}
										aria-label={`Rename ${s}`}
									>
										<PencilIcon />
									</Button>
									{#if linked > 0}
										<Tooltip.Root>
											<Tooltip.Trigger>
												{#snippet child({ props })}
													<span {...props} class="inline-flex">
														<Button
															size="icon-sm"
															variant="ghost"
															disabled
															aria-label={`Cannot delete ${s}`}
														>
															<LockIcon />
														</Button>
													</span>
												{/snippet}
											</Tooltip.Trigger>
											<Tooltip.Content>
												Used by {linked} field{linked === 1 ? '' : 's'}
											</Tooltip.Content>
										</Tooltip.Root>
									{:else if isLast}
										<Tooltip.Root>
											<Tooltip.Trigger>
												{#snippet child({ props })}
													<span {...props} class="inline-flex">
														<Button
															size="icon-sm"
															variant="ghost"
															disabled
															aria-label="Cannot delete last group"
														>
															<Trash2Icon />
														</Button>
													</span>
												{/snippet}
											</Tooltip.Trigger>
											<Tooltip.Content>Keep at least one group</Tooltip.Content>
										</Tooltip.Root>
									{:else}
										<Button
											size="icon-sm"
											variant="ghost"
											class="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
											onclick={() => askDelete(s)}
											disabled={editing !== null}
											aria-label={`Delete ${s}`}
										>
											<Trash2Icon />
										</Button>
									{/if}
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>

		<Sheet.Footer class="flex-row justify-end">
			<Sheet.Close class={buttonVariants({ variant: 'outline' })}>Done</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>

<DeleteDialog
	bind:open={deleteOpen}
	title="Delete group"
	description={deleteTarget && deleteCount === 0
		? `Remove "${deleteTarget}"? This can't be undone.`
		: ''}
	onConfirm={confirmDelete}
/>

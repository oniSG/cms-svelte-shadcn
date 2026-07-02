<script lang="ts">
	import {
		Handle,
		NodeToolbar,
		Position,
		useNodes,
		useSvelteFlow,
		type Node,
		type NodeProps
	} from '@xyflow/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { WorkflowNodeData } from './workflow-types';
	import { createNodeId } from './workflow-data';
	import { workflowItemLabel } from './workflow-labels';
	import { getWorkflowConfigureNode, getWorkflowEditingNode } from './workflow-context';
	import {
		workflowNodeChartColors as colors,
		workflowNodeBoxClasses,
		workflowNodeEditingBorderClass,
		workflowNodeIconClass,
		workflowTriggerShapeStyles
	} from './workflow-node-colors';
	import { workflowItemIcon, workflowItemIconModifier } from './workflow-icons';
	import Copy from '@lucide/svelte/icons/copy';
	import Layers from '@lucide/svelte/icons/layers';
	import X from '@lucide/svelte/icons/x';
	import * as m from '$lib/paraglide/messages.js';

	const triggerPath = 'M2 2H55.72L76 29L55.72 56H2V2Z';

	let { id, data }: NodeProps<Node<WorkflowNodeData>> = $props();

	const { deleteElements, getNode } = useSvelteFlow();
	const nodesStore = useNodes();

	const label = $derived(workflowItemLabel(data.itemId));
	const onConfigureNode = getWorkflowConfigureNode();
	const editingNode = getWorkflowEditingNode();
	const isEditing = $derived(editingNode?.nodeId === id);
	const boxClasses = $derived(workflowNodeBoxClasses(data.itemId, data.variant, isEditing));
	const triggerShapeStyles = $derived(workflowTriggerShapeStyles(isEditing));
	const editingBorderClass = $derived(isEditing ? workflowNodeEditingBorderClass : undefined);
	const iconClass = $derived(workflowNodeIconClass(data.itemId, data.variant));
	const NodeIcon = $derived(workflowItemIcon(data.itemId, data.variant));
	const iconModifier = $derived(workflowItemIconModifier(data.itemId, data.variant));

	let toolbarVisible = $state(false);
	let hideToolbarTimeout: ReturnType<typeof setTimeout> | undefined;

	function showToolbar() {
		if (hideToolbarTimeout) clearTimeout(hideToolbarTimeout);
		toolbarVisible = true;
	}

	function scheduleHideToolbar() {
		hideToolbarTimeout = setTimeout(() => {
			toolbarVisible = false;
		}, 150);
	}

	function openSettings(event: MouseEvent | KeyboardEvent) {
		event.stopPropagation();
		onConfigureNode?.(id);
	}

	function duplicateNode(event: MouseEvent) {
		event.stopPropagation();
		const node = getNode(id);
		if (!node) return;

		const clone = {
			...node,
			id: createNodeId(),
			position: { x: node.position.x + 40, y: node.position.y + 40 },
			selected: false
		};

		nodesStore.update((nodes) => [...nodes, clone]);
	}

	function deleteNode(event: MouseEvent) {
		event.stopPropagation();
		deleteElements({ nodes: [{ id }] });
	}

	const handleBase = '!size-3.5 !border-2';
	const handleInputClass = `${handleBase} relative !left-0 !border-foreground !bg-background after:pointer-events-none after:absolute after:top-1/2 after:left-[55%] after:h-0 after:w-0 after:-translate-x-1/2 after:-translate-y-1/2 after:border-y-[3px] after:border-y-transparent after:border-l-[4px] after:border-l-foreground after:content-['']`;
	const handleNeutralClass = `${handleBase} relative !border-foreground !bg-background after:pointer-events-none after:absolute after:top-1/2 after:left-[55%] after:h-0 after:w-0 after:-translate-x-1/2 after:-translate-y-1/2 after:border-y-[3px] after:border-y-transparent after:border-l-[4px] after:border-l-foreground after:content-['']`;
	const handleYesClass = `${handleBase} ${colors.conditionYesPort}`;
	const handleNoClass = `${handleBase} ${colors.conditionNoPort}`;
	const conditionHandleYesStyle = 'left: 50%; top: 0; transform: translate(-50%, -50%);';
	const conditionHandleNoStyle =
		'left: 50%; bottom: 0; top: auto; transform: translate(-50%, 50%);';
</script>

<NodeToolbar position={Position.Top} align="center" isVisible={toolbarVisible}>
	<div
		class="flex items-center gap-0.5 rounded-md border bg-background p-0.5 shadow-sm"
		onmouseenter={showToolbar}
		onmouseleave={scheduleHideToolbar}
		role="presentation"
	>
		<Button class="size-7" onclick={duplicateNode} size="icon" variant="ghost">
			<Copy class="size-3.5" />
		</Button>
		<Button class="size-7" size="icon" variant="ghost">
			<Layers class="size-3.5" />
		</Button>
		<Button
			class="size-7 text-destructive hover:text-destructive"
			onclick={deleteNode}
			size="icon"
			variant="ghost"
		>
			<X class="size-3.5" />
		</Button>
	</div>
</NodeToolbar>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="relative" onmouseenter={showToolbar} onmouseleave={scheduleHideToolbar}>
	{#if data.variant === 'trigger'}
		<div class="relative z-20 mx-auto h-14 w-[4.75rem]">
			<button
				class="relative block cursor-pointer border-0 bg-transparent p-0"
				aria-label={label}
				onclick={openSettings}
				type="button"
			>
				<div class="relative h-14 w-[4.75rem]">
					<svg
						class="absolute inset-0 size-full overflow-visible"
						viewBox="0 0 78 58"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path d={triggerPath} fill={triggerShapeStyles.backgroundFill} stroke="none" />
						<path
							d={triggerPath}
							fill={triggerShapeStyles.tintFill}
							fill-opacity={triggerShapeStyles.tintOpacity}
							stroke="none"
						/>
						<path
							d={triggerPath}
							class={editingBorderClass}
							fill="none"
							stroke={triggerShapeStyles.stroke}
							stroke-width="2"
							stroke-linejoin="round"
						/>
					</svg>
					<div class="pointer-events-none absolute inset-0 flex items-center justify-center pr-2">
						<NodeIcon class="size-6 {iconClass}" />
					</div>
				</div>
			</button>
			<Handle class="{handleNeutralClass} !right-0" position={Position.Right} type="source" />
		</div>
	{:else if data.variant === 'condition'}
		<div class="relative z-20 mx-auto w-14">
			<button
				class="relative block size-14 cursor-pointer border-0 bg-transparent p-0"
				aria-label={label}
				onclick={openSettings}
				type="button"
			>
				<div class="absolute inset-0 overflow-hidden rounded-lg bg-background">
					<div class="absolute inset-0 {boxClasses.tintClass}" aria-hidden="true"></div>
				</div>
				<svg
					class="pointer-events-none absolute inset-0 size-full"
					viewBox="0 0 56 56"
					aria-hidden="true"
				>
					<rect
						x="1"
						y="1"
						width="54"
						height="54"
						rx="8"
						class="{boxClasses.stroke} {editingBorderClass}"
						fill="none"
						stroke-width="2"
					/>
				</svg>
				<NodeIcon
					class="pointer-events-none absolute inset-0 m-auto size-6 {iconClass} {iconModifier ??
						''}"
				/>
			</button>
			<Handle class={handleInputClass} position={Position.Left} type="target" />
			<Handle
				id="yes"
				class={handleYesClass}
				position={Position.Top}
				type="source"
				style={conditionHandleYesStyle}
			/>
			<Handle
				id="no"
				class={handleNoClass}
				position={Position.Bottom}
				type="source"
				style={conditionHandleNoStyle}
			/>
		</div>
	{:else}
		<div class="relative z-20 mx-auto w-16">
			<button
				class="relative block size-16 cursor-pointer border-0 bg-transparent p-0"
				aria-label={label}
				onclick={openSettings}
				type="button"
			>
				<div class="absolute inset-0 overflow-hidden rounded-[10px] bg-background">
					<div class="absolute inset-0 {boxClasses.tintClass}" aria-hidden="true"></div>
				</div>
				<svg
					class="pointer-events-none absolute inset-0 size-full"
					viewBox="0 0 64 64"
					aria-hidden="true"
				>
					<rect
						x="1"
						y="1"
						width="62"
						height="62"
						rx="10"
						class="{boxClasses.stroke} {editingBorderClass}"
						fill="none"
						stroke-width="2"
					/>
				</svg>
				<NodeIcon
					class="pointer-events-none absolute inset-0 m-auto size-7 {iconClass} {iconModifier ??
						''}"
				/>
			</button>
			<Handle class={handleInputClass} position={Position.Left} type="target" />
			<Handle class="{handleNeutralClass} !right-0" position={Position.Right} type="source" />
		</div>
	{/if}

	<div
		class="pointer-events-none absolute top-full left-1/2 z-10 mt-2 w-max max-w-[9rem] -translate-x-1/2 rounded-sm bg-background px-2 py-0.5 text-center"
	>
		<button
			class="pointer-events-auto max-w-[9rem] cursor-pointer border-0 bg-transparent p-0 text-center text-xs leading-tight text-foreground"
			onclick={openSettings}
			type="button"
		>
			{label}
		</button>
		{#if data.incomplete}
			<p class="text-[10px] leading-tight text-destructive">
				{m.fan_action_flow_must_complete()}
			</p>
		{/if}
	</div>
</div>

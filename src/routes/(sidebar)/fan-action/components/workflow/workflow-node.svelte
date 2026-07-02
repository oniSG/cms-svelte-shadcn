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
		workflowNodeBoxShapeStyles,
		workflowNodeEditingBorderClass,
		workflowNodeIconClass,
		workflowTriggerShapeStyles,
		workflowConditionNodeBox,
		workflowConditionNodeBounds,
		workflowActionNodeBox,
		workflowTriggerNodeBox,
		workflowNodeBoxRect
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
	const boxShapeStyles = $derived(workflowNodeBoxShapeStyles(data.itemId, data.variant, isEditing));
	const conditionRect = workflowNodeBoxRect(
		workflowConditionNodeBox.size,
		workflowConditionNodeBox.stroke
	);
	const actionRect = workflowNodeBoxRect(workflowActionNodeBox.size, workflowActionNodeBox.stroke);
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

	const handleBase = '!size-[1.09375rem] !border-2';
	const handleArrowClass = 'after:border-y-[3px] after:border-l-[4px]';
	const handleInputClass = `${handleBase} relative !left-0 !border-foreground !bg-background after:pointer-events-none after:absolute after:top-1/2 after:left-[55%] after:h-0 after:w-0 after:-translate-x-1/2 after:-translate-y-1/2 after:border-y-transparent ${handleArrowClass} after:border-l-foreground after:content-['']`;
	const handleNeutralClass = `${handleBase} relative !border-foreground !bg-background after:pointer-events-none after:absolute after:top-1/2 after:left-[55%] after:h-0 after:w-0 after:-translate-x-1/2 after:-translate-y-1/2 after:border-y-transparent ${handleArrowClass} after:border-l-foreground after:content-['']`;
	const handleYesClass = `${handleBase} ${colors.conditionYesPort}`;
	const handleNoClass = `${handleBase} ${colors.conditionNoPort}`;
	const conditionHandleYesStyle = 'left: 75%; top: 25%; transform: translate(-50%, -50%);';
	const conditionHandleNoStyle = 'left: 75%; top: 75%; transform: translate(-50%, -50%);';
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
		<div
			class="relative z-20 mx-auto"
			style:height="{workflowTriggerNodeBox.height}px"
			style:width="{workflowTriggerNodeBox.width}px"
		>
			<button
				class="relative block cursor-pointer border-0 bg-transparent p-0"
				aria-label={label}
				onclick={openSettings}
				type="button"
			>
				<div
					class="relative"
					style:height="{workflowTriggerNodeBox.height}px"
					style:width="{workflowTriggerNodeBox.width}px"
				>
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
					<div class="pointer-events-none absolute inset-0 flex items-center justify-center pr-2.5">
						<NodeIcon class="size-[1.875rem] {iconClass}" />
					</div>
				</div>
			</button>
			<Handle class="{handleNeutralClass} !right-0" position={Position.Right} type="source" />
		</div>
	{:else if data.variant === 'condition'}
		{@const conditionBounds = workflowConditionNodeBounds()}
		<div
			class="relative z-20 mx-auto"
			style:width="{conditionBounds}px"
			style:height="{conditionBounds}px"
		>
			<button
				class="absolute top-1/2 left-1/2 block -translate-x-1/2 -translate-y-1/2 rotate-45 cursor-pointer border-0 bg-transparent p-0"
				style:width="{workflowConditionNodeBox.size}px"
				style:height="{workflowConditionNodeBox.size}px"
				aria-label={label}
				onclick={openSettings}
				type="button"
			>
				<svg
					class="size-full"
					viewBox="0 0 {workflowConditionNodeBox.size} {workflowConditionNodeBox.size}"
					aria-hidden="true"
				>
					<rect
						x={conditionRect.x}
						y={conditionRect.y}
						width={conditionRect.width}
						height={conditionRect.height}
						rx={workflowConditionNodeBox.radius}
						fill={boxShapeStyles.backgroundFill}
						stroke="none"
					/>
					<rect
						x={conditionRect.x}
						y={conditionRect.y}
						width={conditionRect.width}
						height={conditionRect.height}
						rx={workflowConditionNodeBox.radius}
						fill={boxShapeStyles.tintFill}
						fill-opacity={boxShapeStyles.tintOpacity}
						stroke="none"
					/>
					<rect
						x={conditionRect.x}
						y={conditionRect.y}
						width={conditionRect.width}
						height={conditionRect.height}
						rx={workflowConditionNodeBox.radius}
						class={editingBorderClass}
						fill="none"
						stroke={boxShapeStyles.stroke}
						stroke-width={workflowConditionNodeBox.stroke}
					/>
				</svg>
			</button>
			<NodeIcon
				class="pointer-events-none absolute top-1/2 left-1/2 size-[1.875rem] -translate-x-1/2 -translate-y-1/2 {iconClass} {iconModifier ??
					''}"
			/>
			<Handle class={handleInputClass} position={Position.Left} type="target" />
			<Handle
				id="yes"
				class={handleYesClass}
				position={Position.Right}
				type="source"
				style={conditionHandleYesStyle}
			/>
			<Handle
				id="no"
				class={handleNoClass}
				position={Position.Right}
				type="source"
				style={conditionHandleNoStyle}
			/>
		</div>
	{:else}
		<div class="relative z-20 mx-auto w-20">
			<button
				class="relative block size-20 cursor-pointer border-0 bg-transparent p-0"
				aria-label={label}
				onclick={openSettings}
				type="button"
			>
				<svg
					class="size-full"
					viewBox="0 0 {workflowActionNodeBox.size} {workflowActionNodeBox.size}"
					aria-hidden="true"
				>
					<rect
						x={actionRect.x}
						y={actionRect.y}
						width={actionRect.width}
						height={actionRect.height}
						rx={workflowActionNodeBox.radius}
						fill={boxShapeStyles.backgroundFill}
						stroke="none"
					/>
					<rect
						x={actionRect.x}
						y={actionRect.y}
						width={actionRect.width}
						height={actionRect.height}
						rx={workflowActionNodeBox.radius}
						fill={boxShapeStyles.tintFill}
						fill-opacity={boxShapeStyles.tintOpacity}
						stroke="none"
					/>
					<rect
						x={actionRect.x}
						y={actionRect.y}
						width={actionRect.width}
						height={actionRect.height}
						rx={workflowActionNodeBox.radius}
						class={editingBorderClass}
						fill="none"
						stroke={boxShapeStyles.stroke}
						stroke-width={workflowActionNodeBox.stroke}
					/>
				</svg>
				<NodeIcon
					class="pointer-events-none absolute inset-0 m-auto size-[2.1875rem] {iconClass} {iconModifier ??
						''}"
				/>
			</button>
			<Handle class={handleInputClass} position={Position.Left} type="target" />
			<Handle class="{handleNeutralClass} !right-0" position={Position.Right} type="source" />
		</div>
	{/if}

	<div
		class="pointer-events-none absolute top-full left-1/2 z-10 mt-2.5 w-max max-w-[11.25rem] -translate-x-1/2 rounded-sm bg-background px-2.5 py-0.5 text-center"
	>
		<button
			class="pointer-events-auto max-w-[11.25rem] cursor-pointer border-0 bg-transparent p-0 text-center text-xs leading-tight text-foreground"
			onclick={openSettings}
			type="button"
		>
			{label}
		</button>
		{#if data.incomplete}
			<p class="text-[12.5px] leading-tight text-destructive">
				{m.fan_action_flow_must_complete()}
			</p>
		{/if}
	</div>
</div>

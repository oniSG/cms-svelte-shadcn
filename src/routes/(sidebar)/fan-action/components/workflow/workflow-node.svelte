<script lang="ts">
	import {
		Handle,
		NodeToolbar,
		Position,
		portal,
		useNodes,
		useSvelteFlow,
		type Node,
		type NodeProps
	} from '@xyflow/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { WorkflowNodeData } from './workflow-types';
	import { createNodeId } from './workflow-data';
	import { workflowItemLabel } from './workflow-labels';
	import { getWorkflowConfigureNode, getWorkflowEditingNodeId } from './workflow-context';
	import {
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
	import { workflowConditionBranchStyles } from './workflow-condition-branch-styles';
	import { workflowItemIcon, workflowItemIconModifier } from './workflow-icons';
	import Copy from '@lucide/svelte/icons/copy';
	import X from '@lucide/svelte/icons/x';
	import * as m from '$lib/paraglide/messages.js';

	const triggerPath = 'M2 2H55.72L76 29L55.72 56H2V2Z';

	let {
		id,
		data,
		positionAbsoluteX,
		positionAbsoluteY,
		width,
		height
	}: NodeProps<Node<WorkflowNodeData>> = $props();

	const { deleteElements, getNode } = useSvelteFlow();
	const nodesStore = useNodes();

	const label = $derived(workflowItemLabel(data.itemId));
	const onConfigureNode = getWorkflowConfigureNode();
	const getEditingNodeId = getWorkflowEditingNodeId();
	const isEditing = $derived(getEditingNodeId?.() === id);
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
	const handleArrowStyles = `${handleBase} relative !border-foreground !bg-background after:pointer-events-none after:absolute after:top-1/2 after:left-[55%] after:h-0 after:w-0 after:-translate-x-1/2 after:-translate-y-1/2 after:border-y-transparent ${handleArrowClass} after:border-l-foreground after:content-['']`;
	const handleInputClass = `${handleArrowStyles} !left-0`;
	const handleNeutralClass = handleArrowStyles;
	const handleYesClass = `${handleBase} ${workflowConditionBranchStyles.yes.port}`;
	const handleNoClass = `${handleBase} ${workflowConditionBranchStyles.no.port}`;
	const conditionHandleYesStyle = 'left: 75%; top: 25%; transform: translate(-50%, -50%);';
	const conditionHandleNoStyle = 'left: 75%; top: 75%; transform: translate(-50%, -50%);';

	const workflowNodeButtonResetClass =
		'!block h-auto min-h-0 w-auto gap-0 rounded-none border-0 bg-transparent p-0 font-normal shadow-none transition-none hover:bg-transparent focus-visible:ring-0';
	const workflowNodeButtonClass = `${workflowNodeButtonResetClass} active:not-aria-[haspopup]:!translate-y-0`;
	const workflowNodeConditionButtonClass = `${workflowNodeButtonResetClass} active:not-aria-[haspopup]:-translate-x-1/2 active:not-aria-[haspopup]:-translate-y-1/2 active:not-aria-[haspopup]:rotate-45`;
	const workflowNodeLabelButtonClass =
		'h-auto max-w-[11.25rem] gap-0 rounded-none border-0 bg-transparent p-0 text-center text-xs leading-tight font-normal text-foreground shadow-none transition-none hover:bg-transparent focus-visible:ring-0 active:not-aria-[haspopup]:!translate-y-0';

	const nodeShapeSize = $derived.by(() => {
		if (data.variant === 'trigger') {
			return { width: workflowTriggerNodeBox.width, height: workflowTriggerNodeBox.height };
		}
		if (data.variant === 'condition') {
			const bounds = workflowConditionNodeBounds();
			return { width: bounds, height: bounds };
		}
		return { width: workflowActionNodeBox.size, height: workflowActionNodeBox.size };
	});

	const labelX = $derived(positionAbsoluteX + (width ?? nodeShapeSize.width) / 2);
	const labelY = $derived(positionAbsoluteY + (height ?? nodeShapeSize.height) + 10);
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
			<Button
				variant="ghost"
				class="{workflowNodeButtonClass} relative cursor-pointer"
				aria-label={label}
				onclick={openSettings}
			>
				<div
					class="relative"
					style:height="{workflowTriggerNodeBox.height}px"
					style:width="{workflowTriggerNodeBox.width}px"
				>
					<svg
						class="absolute inset-0 size-full overflow-visible"
						viewBox="0 0 78 58"
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
							stroke-width={workflowTriggerNodeBox.stroke}
							stroke-linejoin="round"
						/>
					</svg>
					<div class="pointer-events-none absolute inset-0 flex items-center justify-center pr-2.5">
						<NodeIcon class="size-[1.875rem] {iconClass}" />
					</div>
				</div>
			</Button>
			<Handle class="{handleNeutralClass} !right-0" position={Position.Right} type="source" />
		</div>
	{:else if data.variant === 'condition'}
		{@const conditionBounds = workflowConditionNodeBounds()}
		<div
			class="relative z-20 mx-auto"
			style:width="{conditionBounds}px"
			style:height="{conditionBounds}px"
		>
			<Button
				variant="ghost"
				class="{workflowNodeConditionButtonClass} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 cursor-pointer"
				style="width: {workflowConditionNodeBox.size}px; height: {workflowConditionNodeBox.size}px"
				aria-label={label}
				onclick={openSettings}
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
			</Button>
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
			<Button
				variant="ghost"
				class="{workflowNodeButtonClass} relative size-20 cursor-pointer"
				aria-label={label}
				onclick={openSettings}
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
			</Button>
			<Handle class={handleInputClass} position={Position.Left} type="target" />
			<Handle class="{handleNeutralClass} !right-0" position={Position.Right} type="source" />
		</div>
	{/if}
</div>

<div
	use:portal={'edge-labels'}
	class="workflow-node-label pointer-events-none absolute z-0 w-max max-w-[11.25rem] text-center"
	style:transform="translate(-50%, 0) translate({labelX}px, {labelY}px)"
>
	<Button
		variant="ghost"
		class="{workflowNodeLabelButtonClass} pointer-events-auto max-w-[11.25rem] cursor-pointer"
		onclick={openSettings}
	>
		{label}
	</Button>
	{#if data.incomplete}
		<p class="text-[12.5px] leading-tight text-destructive">
			{m.fan_action_flow_must_complete()}
		</p>
	{/if}
</div>

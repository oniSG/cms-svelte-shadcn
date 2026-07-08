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
	import * as ButtonGroup from '$lib/components/ui/button-group/index.js';
	import type { WorkflowNodeData } from './types';
	import { createNodeId } from './flow-utils';
	import { workflowItemLabel } from './workflow-items';
	import WorkflowNodeIcon from './workflow-node-icon.svelte';
	import {
		getWorkflowConfigureNode,
		getWorkflowEditingNodeId,
		WORKFLOW_EDITED_BY_OTHER
	} from './editing-context';
	import { cn } from '$lib/utils.js';
	import {
		workflowNodeBoxShapeStyles,
		workflowNodeEditingBorderClass,
		workflowTriggerShapeStyles,
		workflowConditionNodeBox,
		workflowConditionNodeBounds,
		workflowActionNodeBox,
		workflowTriggerNodeBox,
		workflowTriggerPath,
		workflowNodeBoxRect,
		workflowNodeLabelOffset
	} from './node-styles';
	import { workflowConditionBranchStyles } from './condition-branch-styles';
	import Copy from '@lucide/svelte/icons/copy';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import X from '@lucide/svelte/icons/x';
	import * as m from '$lib/paraglide/messages.js';

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

	const handleBase =
		'!flex !size-[1.09375rem] !items-center !justify-center !rounded-full !border-2 !border-foreground !bg-background [&_svg]:size-2.5 [&_svg]:stroke-[2.5] [&_svg]:text-foreground';
	const handleArrowClass = handleBase;
	const handleInputClass = `${handleArrowClass} !left-0`;
	const handleNeutralClass = handleArrowClass;
	const handleYesClass = `!size-[1.09375rem] !rounded-full !border-0 ${workflowConditionBranchStyles.yes.port}`;
	const handleNoClass = `!size-[1.09375rem] !rounded-full !border-0 ${workflowConditionBranchStyles.no.port}`;
	const conditionHandleYesStyle = 'left: 75%; top: 25%; transform: translate(-50%, -50%);';
	const conditionHandleNoStyle = 'left: 75%; top: 75%; transform: translate(-50%, -50%);';

	const workflowNodeButtonResetClass =
		'!block h-auto min-h-0 w-auto gap-0 rounded-none border-0 bg-transparent p-0 font-normal shadow-none transition-none hover:bg-transparent focus-visible:ring-0';
	const workflowNodeButtonClass = `${workflowNodeButtonResetClass} active:not-aria-[haspopup]:!translate-y-0`;
	const workflowNodeConditionButtonClass = `${workflowNodeButtonResetClass} active:not-aria-[haspopup]:-translate-x-1/2 active:not-aria-[haspopup]:-translate-y-1/2 active:not-aria-[haspopup]:rotate-45`;
	const workflowNodeLabelButtonClass =
		'h-auto max-w-[11.25rem] gap-0 rounded-none border-0 bg-transparent p-0 text-center text-sm leading-tight font-normal text-foreground shadow-none transition-none hover:bg-transparent focus-visible:ring-0 active:not-aria-[haspopup]:!translate-y-0';

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
	const labelY = $derived(
		positionAbsoluteY + (height ?? nodeShapeSize.height) + workflowNodeLabelOffset
	);
</script>

<NodeToolbar position={Position.Top} align="center" isVisible={toolbarVisible}>
	<div onmouseenter={showToolbar} onmouseleave={scheduleHideToolbar} role="presentation">
		<ButtonGroup.Root
			class={cn(
				'overflow-hidden rounded-4xl bg-workflow-canvas-base',
				WORKFLOW_EDITED_BY_OTHER && 'grayscale'
			)}
		>
			<Button
				type="button"
				size="icon-sm"
				variant="outline"
				class="px-2"
				onclick={duplicateNode}
				aria-label={m.log_type_action_duplicate()}
			>
				<Copy />
			</Button>
			<Button
				type="button"
				size="icon-sm"
				variant="outline"
				class="px-2 text-destructive hover:text-destructive"
				onclick={deleteNode}
				aria-label={m.common_delete()}
			>
				<X />
			</Button>
		</ButtonGroup.Root>
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
						viewBox="0 0 {workflowTriggerNodeBox.viewBox.width} {workflowTriggerNodeBox.viewBox
							.height}"
						aria-hidden="true"
					>
						<path d={workflowTriggerPath} fill={triggerShapeStyles.backgroundFill} stroke="none" />
						<path
							d={workflowTriggerPath}
							fill={triggerShapeStyles.tintFill}
							fill-opacity={triggerShapeStyles.tintOpacity}
							stroke="none"
						/>
						<path
							d={workflowTriggerPath}
							class={editingBorderClass}
							fill="none"
							stroke={triggerShapeStyles.stroke}
							stroke-width={workflowTriggerNodeBox.stroke}
							stroke-linejoin="round"
							stroke-linecap="round"
						/>
					</svg>
					<div class="pointer-events-none absolute inset-0 flex items-center justify-center pr-2.5">
						<WorkflowNodeIcon itemId={data.itemId} variant={data.variant} class="size-[1.875rem]" />
					</div>
				</div>
			</Button>
			<Handle class="{handleNeutralClass} !right-0" position={Position.Right} type="source">
				<ChevronRight aria-hidden="true" />
			</Handle>
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
			<div class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<WorkflowNodeIcon itemId={data.itemId} variant={data.variant} class="size-[1.875rem]" />
			</div>
			<Handle class={handleInputClass} position={Position.Left} type="target">
				<ChevronRight aria-hidden="true" />
			</Handle>
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
				<div class="pointer-events-none absolute inset-0 m-auto flex items-center justify-center">
					<WorkflowNodeIcon
						itemId={data.itemId}
						variant={data.variant}
						class="size-[2.1875rem]"
						glowClass="size-12"
					/>
				</div>
			</Button>
			<Handle class={handleInputClass} position={Position.Left} type="target">
				<ChevronRight aria-hidden="true" />
			</Handle>
			<Handle class="{handleNeutralClass} !right-0" position={Position.Right} type="source">
				<ChevronRight aria-hidden="true" />
			</Handle>
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
		<p class="text-sm leading-tight text-destructive">
			{m.fan_action_flow_must_complete()}
		</p>
	{/if}
</div>

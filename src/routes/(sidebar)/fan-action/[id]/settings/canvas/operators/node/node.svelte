<script lang="ts">
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
			<Handle class={handleFlowInputClass} position={Position.Left} type="target">
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
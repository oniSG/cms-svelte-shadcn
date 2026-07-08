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
    <Handle class={handleFlowInputClass} position={Position.Left} type="target">
        <ChevronRight aria-hidden="true" />
    </Handle>
    <Handle class={handleFlowOutputClass} position={Position.Right} type="source">
        <ChevronRight aria-hidden="true" />
    </Handle>
</div>
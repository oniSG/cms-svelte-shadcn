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
			<Handle class={handleFlowOutputClass} position={Position.Right} type="source">
				<ChevronRight aria-hidden="true" />
			</Handle>
		</div>
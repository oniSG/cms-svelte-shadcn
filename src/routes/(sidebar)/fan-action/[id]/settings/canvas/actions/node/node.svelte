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
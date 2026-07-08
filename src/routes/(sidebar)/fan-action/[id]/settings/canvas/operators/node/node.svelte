
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
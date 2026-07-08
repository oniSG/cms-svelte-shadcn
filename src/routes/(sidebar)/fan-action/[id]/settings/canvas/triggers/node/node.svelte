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
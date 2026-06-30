<script lang="ts">
	import {
		Handle,
		NodeToolbar,
		Position,
		useEdges,
		useNodes,
		useSvelteFlow,
		type Node,
		type NodeProps
	} from '@xyflow/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { WorkflowNodeData } from './workflow-types';
	import { createNodeId } from './workflow-data';
	import { workflowItemLabel } from './workflow-labels';
	import { getWorkflowConfigureNode } from './workflow-context';
	import { workflowNodeChartColors as colors } from './workflow-node-colors';
	import Forward from '@lucide/svelte/icons/forward';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import Mail from '@lucide/svelte/icons/mail';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import Clock from '@lucide/svelte/icons/clock';
	import Copy from '@lucide/svelte/icons/copy';
	import Layers from '@lucide/svelte/icons/layers';
	import X from '@lucide/svelte/icons/x';
	import * as m from '$lib/paraglide/messages.js';

	let { id, data }: NodeProps<Node<WorkflowNodeData>> = $props();

	const { deleteElements, getNode } = useSvelteFlow();
	const nodesStore = useNodes();
	const edgesStore = useEdges();

	const label = $derived(workflowItemLabel(data.itemId));

	const outgoingCount = $derived(edgesStore.current.filter((edge) => edge.source === id).length);
	const yesCount = $derived(
		edgesStore.current.filter((edge) => edge.source === id && edge.sourceHandle === 'yes').length
	);
	const noCount = $derived(
		edgesStore.current.filter((edge) => edge.source === id && edge.sourceHandle === 'no').length
	);

	let toolbarVisible = $state(false);
	let hideToolbarTimeout: ReturnType<typeof setTimeout> | undefined;

	const onConfigureNode = getWorkflowConfigureNode();

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
	const handleYesClass = `${handleBase} !top-0 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 ${colors.conditionYesPort}`;
	const handleNoClass = `${handleBase} !bottom-0 !left-1/2 !-translate-x-1/2 !translate-y-1/2 ${colors.conditionNoPort}`;
	const portBadgeClass =
		'absolute z-[1] min-w-[1.125rem] rounded-full bg-muted-foreground px-1 text-center text-[10px] leading-4 font-semibold text-white';
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
<div
	class="flex flex-col items-center gap-1.5"
	onmouseenter={showToolbar}
	onmouseleave={scheduleHideToolbar}
>
	{#if data.variant === 'trigger'}
		<div class="relative">
			<button
				class="relative block cursor-pointer border-0 bg-transparent p-0"
				aria-label={label}
				onclick={openSettings}
				type="button"
			>
				{#if outgoingCount > 0}
					<span class="{portBadgeClass} -top-2 left-1/2 -translate-x-1/2">{outgoingCount}</span>
				{/if}
				<div class="relative h-14 w-[4.75rem]">
					<svg
						class="absolute inset-0 size-full overflow-visible"
						viewBox="0 0 78 58"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							d="M2 2H55.72L76 29L55.72 56H2V2Z"
							class="{colors.triggerSvgFill} {colors.triggerSvgStroke}"
							stroke-width="2"
							stroke-linejoin="round"
						/>
					</svg>
					<div class="pointer-events-none absolute inset-0 flex items-center justify-center pr-2">
						<Forward class="size-6 {colors.trigger.icon}" />
					</div>
				</div>
			</button>
			<Handle class="{handleNeutralClass} !right-0" position={Position.Right} type="source" />
		</div>
	{:else if data.variant === 'condition'}
		<div class="relative">
			<button
				class="relative block cursor-pointer border-0 bg-transparent p-0"
				aria-label={label}
				onclick={openSettings}
				type="button"
			>
				<div
					class="flex size-14 items-center justify-center rounded-lg shadow-sm {colors.condition
						.surface}"
				>
					<Shuffle class="size-6 {colors.condition.icon}" />
				</div>
			</button>
			<Handle class={handleInputClass} position={Position.Left} type="target" />
			<Handle id="yes" class={handleYesClass} position={Position.Top} type="source" />
			<Handle id="no" class={handleNoClass} position={Position.Bottom} type="source" />
			{#if yesCount > 0}
				<span class="{portBadgeClass} top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
					>{yesCount}</span
				>
			{/if}
			{#if noCount > 0}
				<span class="{portBadgeClass} bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
					>{noCount}</span
				>
			{/if}
		</div>
	{:else}
		<div class="relative">
			<button
				class="relative block cursor-pointer border-0 bg-transparent p-0"
				aria-label={label}
				onclick={openSettings}
				type="button"
			>
				{#if outgoingCount > 0}
					<span class="{portBadgeClass} -top-2 left-1/2 -translate-x-1/2">{outgoingCount}</span>
				{/if}
				<div
					class="flex size-16 items-center justify-center rounded-lg shadow-sm {colors.action
						.surface}"
				>
					{#if data.itemId === 'sms'}
						<MessageSquare class="size-7 {colors.action.icon}" />
					{:else if data.itemId === 'push'}
						<Smartphone class="size-7 {colors.action.icon}" />
					{:else if data.itemId === 'wait'}
						<Clock class="size-7 {colors.action.icon}" />
					{:else}
						<Mail class="size-7 {colors.action.icon}" />
					{/if}
				</div>
			</button>
			<Handle class={handleInputClass} position={Position.Left} type="target" />
			<Handle class="{handleNeutralClass} !right-0" position={Position.Right} type="source" />
		</div>
	{/if}

	<button
		class="max-w-[9rem] cursor-pointer border-0 bg-transparent p-0 text-center text-xs leading-tight text-foreground"
		onclick={openSettings}
		type="button"
	>
		{label}
	</button>
	{#if data.incomplete}
		<p class="max-w-[9rem] text-center text-[10px] leading-tight text-destructive">
			{m.fan_action_flow_must_complete()}
		</p>
	{/if}
</div>

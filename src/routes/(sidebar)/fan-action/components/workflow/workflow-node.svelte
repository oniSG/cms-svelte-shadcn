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
	import Forward from '@lucide/svelte/icons/forward';
	import GitFork from '@lucide/svelte/icons/git-fork';
	import Mail from '@lucide/svelte/icons/mail';
	import Settings2 from '@lucide/svelte/icons/settings-2';
	import Copy from '@lucide/svelte/icons/copy';
	import Layers from '@lucide/svelte/icons/layers';
	import X from '@lucide/svelte/icons/x';
	import * as m from '$lib/paraglide/messages.js';

	let { id, data, selected }: NodeProps<Node<WorkflowNodeData>> = $props();

	const { deleteElements, getNode, updateNodeData } = useSvelteFlow();
	const nodesStore = useNodes();

	const headerClass = $derived(
		data.variant === 'trigger'
			? 'bg-sky-500'
			: data.variant === 'condition'
				? 'bg-orange-400'
				: 'bg-emerald-500'
	);

	function duplicateNode() {
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

	function deleteNode() {
		deleteElements({ nodes: [{ id }] });
	}

	function toggleIncomplete() {
		updateNodeData(id, { incomplete: !data.incomplete });
	}
</script>

<NodeToolbar position={Position.Top} align="center" isVisible={selected}>
	<div class="flex items-center gap-0.5 rounded-md border bg-background p-0.5 shadow-sm">
		<Button class="size-7" onclick={toggleIncomplete} size="icon" variant="ghost">
			<Settings2 class="size-3.5" />
		</Button>
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

<div class="min-w-[168px] overflow-hidden rounded-md border bg-background shadow-sm">
	<div class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white {headerClass}">
		{#if data.variant === 'trigger'}
			<Forward class="size-4 shrink-0" />
		{:else if data.variant === 'condition'}
			<GitFork class="size-4 shrink-0 rotate-90" />
		{:else}
			<Mail class="size-4 shrink-0" />
		{/if}
		<span class="truncate">{data.label}</span>
	</div>
	{#if data.incomplete}
		<p class="border-t px-3 py-1.5 text-xs text-destructive">{m.fan_action_flow_must_complete()}</p>
	{/if}
</div>

{#if data.variant === 'trigger'}
	<Handle
		class="!size-2.5 !border-2 !border-background !bg-muted-foreground"
		position={Position.Right}
		type="source"
	/>
{:else if data.variant === 'condition'}
	<Handle
		class="!size-2.5 !border-2 !border-background !bg-muted-foreground"
		position={Position.Top}
		type="target"
	/>
	<Handle
		class="!size-2.5 !border-2 !border-background !bg-muted-foreground"
		position={Position.Bottom}
		type="source"
	/>
{:else}
	<Handle
		class="!size-2.5 !border-2 !border-background !bg-muted-foreground"
		position={Position.Top}
		type="target"
	/>
{/if}

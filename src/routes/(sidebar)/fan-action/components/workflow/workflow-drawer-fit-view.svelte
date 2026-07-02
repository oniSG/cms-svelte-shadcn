<script lang="ts">
	import { getViewportForBounds } from '@xyflow/system';
	import { useSvelteFlow, useStore } from '@xyflow/svelte';

	const fitViewOptions = { padding: 0.2, duration: 0 };

	let { onReady }: { onReady?: (fitView: () => void) => void } = $props();

	const { getNodesBounds, setViewport } = useSvelteFlow();
	const store = useStore();

	async function runFitView() {
		const domNode = store.domNode;
		if (!domNode) return;

		const width = domNode.clientWidth;
		const height = domNode.clientHeight;
		if (!width || !height) return;

		const bounds = getNodesBounds(store.nodes);
		if (!bounds.width || !bounds.height) return;

		const viewport = getViewportForBounds(
			bounds,
			width,
			height,
			store.minZoom,
			store.maxZoom,
			fitViewOptions.padding
		);

		await setViewport(viewport, {
			duration: fitViewOptions.duration
		});
	}

	function scheduleFitView() {
		requestAnimationFrame(() => {
			void runFitView();
		});
	}

	$effect(() => {
		if (!onReady) return;
		onReady(scheduleFitView);
	});

	$effect(() => {
		const domNode = store.domNode;
		if (!domNode) return;

		let skipInitial = true;
		let timeout: ReturnType<typeof setTimeout>;
		let previousWidth = domNode.clientWidth;

		const observer = new ResizeObserver(() => {
			const nextWidth = domNode.clientWidth;
			if (nextWidth === previousWidth) return;
			previousWidth = nextWidth;

			if (skipInitial) {
				skipInitial = false;
				return;
			}

			clearTimeout(timeout);
			timeout = setTimeout(scheduleFitView, 0);
		});

		observer.observe(domNode);

		return () => {
			observer.disconnect();
			clearTimeout(timeout);
		};
	});
</script>

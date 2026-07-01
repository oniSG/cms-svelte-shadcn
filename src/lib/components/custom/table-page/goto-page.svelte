<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		currentPage,
		totalPages,
		onGoto
	}: {
		currentPage: number;
		totalPages: number;
		onGoto: (page: number) => void;
	} = $props();

	let focused = $state(false);
	let localValue = $state('');

	const displayValue = $derived(focused ? localValue : String(currentPage));
	const inputWidth = $derived(`${Math.max(2, displayValue.length + 1)}ch`);

	function onFocus(e: FocusEvent) {
		focused = true;
		localValue = String(currentPage);
		const target = e.target as HTMLInputElement;
		requestAnimationFrame(() => target.select());
	}

	function onBlur() {
		if (!focused) return;
		focused = false;
		const n = parseInt(localValue, 10);
		if (Number.isFinite(n) && n >= 1 && n !== currentPage) {
			onGoto(Math.min(n, totalPages));
		}
	}

	function onBeforeInput(e: InputEvent) {
		if (e.data == null) return;
		if (!/^\d+$/.test(e.data)) {
			e.preventDefault();
			return;
		}
		const target = e.target as HTMLInputElement;
		const start = target.selectionStart ?? target.value.length;
		const end = target.selectionEnd ?? start;
		const next = target.value.slice(0, start) + e.data + target.value.slice(end);
		if (parseInt(next, 10) > totalPages) e.preventDefault();
	}

	function onInput(e: Event) {
		localValue = (e.target as HTMLInputElement).value;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			(e.target as HTMLInputElement).blur();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			localValue = String(currentPage);
			(e.target as HTMLInputElement).blur();
		}
	}
</script>

<InputGroup.Root
	class="h-8 w-auto rounded-none border-t border-r border-l-0 border-border bg-background"
>
	<InputGroup.Input
		type="text"
		inputmode="numeric"
		pattern="[0-9]*"
		maxlength={String(totalPages).length}
		aria-label={m.tp_goto_page()}
		value={displayValue}
		onfocus={onFocus}
		onblur={onBlur}
		onbeforeinput={onBeforeInput}
		oninput={onInput}
		onkeydown={onKeydown}
		style="width: {inputWidth}"
		class="box-content flex-none px-2 text-center text-sm tabular-nums"
	/>
	<InputGroup.Addon align="inline-end" class="pr-3 pl-0 tabular-nums">
		/ {totalPages}
	</InputGroup.Addon>
</InputGroup.Root>

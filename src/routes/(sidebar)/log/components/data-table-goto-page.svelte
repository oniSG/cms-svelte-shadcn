<!--
  data-table-goto-page.svelte — "page X / Y" pill with editable left half.

  Built on shadcn `InputGroup`: editable current-page is the input,
  inline-end addon is the ghost "/ {totalPages}". Designed to drop inside
  `ButtonGroup` alongside outline buttons — the parent group harmonises
  borders and rounding automatically.

  ## Validation strategy

  All filtering happens at `onbeforeinput`, which fires *before* the DOM
  value changes. preventDefault() cancels the change entirely → no flicker,
  no "letter briefly appears then vanishes". Two rejection paths:

    1. Non-digit data (typed letter, mixed paste, IME) → reject.
    2. Insertion that would make the value > totalPages → reject.

  Deletions (`e.data == null`) are always allowed.

  ## State model

  `localValue` holds the user's in-progress text; `focused` tracks edit
  mode. When not focused, displayValue mirrors `currentPage` — so external
  page changes (prev/next, page-bar) update the input automatically. When
  focused, displayValue mirrors `localValue` — so the user's edit is
  preserved through re-renders.

  ## Interaction

  - Click input → focus → `localValue` syncs to currentPage → select-all
    via rAF so the next typed character replaces the page number.
  - Enter → blur → submit.
  - Esc → revert localValue → blur → submit-with-no-change → does nothing.
  - Click away → blur → submit.
-->
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

	// When focused, the input shows the user's in-progress edit.
	// When idle, it mirrors currentPage — external page changes flow through.
	const displayValue = $derived(focused ? localValue : String(currentPage));

	// Width = display content + 1ch caret buffer; never narrower than 2ch.
	// Grows from the second typed digit onward (e.g. "1"=2ch, "12"=3ch).
	const inputWidth = $derived(`${Math.max(2, displayValue.length + 1)}ch`);

	function onFocus(e: FocusEvent) {
		focused = true;
		localValue = String(currentPage);
		// Select-all so the next typed character replaces the page number.
		// rAF avoids racing with the browser's native caret-positioning.
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
		// null data = deletion/composition — always allow.
		if (e.data == null) return;

		// Reject any non-digit data (typed letters, mixed paste, IME).
		if (!/^\d+$/.test(e.data)) {
			e.preventDefault();
			return;
		}

		// Reject if the resulting value would exceed totalPages.
		const target = e.target as HTMLInputElement;
		const start = target.selectionStart ?? target.value.length;
		const end = target.selectionEnd ?? start;
		const next = target.value.slice(0, start) + e.data + target.value.slice(end);
		if (parseInt(next, 10) > totalPages) {
			e.preventDefault();
		}
	}

	function onInput(e: Event) {
		// onbeforeinput already validated — just mirror the DOM value into state.
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
		aria-label={m.log_pagination_goto_aria()}
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

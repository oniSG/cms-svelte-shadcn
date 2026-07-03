<script lang="ts">
	import type { WorkflowDrawerContentProps } from '../types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import Info from '@lucide/svelte/icons/info';
	import Copy from '@lucide/svelte/icons/copy';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import X from '@lucide/svelte/icons/x';
	import Plus from '@lucide/svelte/icons/plus';
	import * as m from '$lib/paraglide/messages.js';

	let {}: WorkflowDrawerContentProps = $props();

	type ConditionFieldId = 'email';
	type ConditionOperator = 'contains' | 'equals' | 'not_contains' | 'starts_with' | 'ends_with';

	type ConditionRule = {
		id: string;
		fieldId: ConditionFieldId;
		operator: ConditionOperator;
		value: string;
	};

	type ConditionBlock = {
		id: string;
		rules: ConditionRule[];
	};

	const labelClass = 'text-sm font-medium text-muted-foreground';
	const sectionTitleClass = 'text-sm font-semibold text-foreground';
	const fieldClass = 'rounded-3xl border border-border bg-background';
	const selectTriggerClass = 'w-full rounded-3xl border border-border bg-background';
	const blockClass = 'space-y-3 rounded-2xl border border-border bg-muted/30 p-4';
	const ruleClass = 'space-y-2 rounded-2xl border border-border bg-background p-3';

	const operators = $derived([
		{ id: 'contains', label: m.fan_action_flow_condition_operator_contains },
		{ id: 'equals', label: m.fan_action_flow_condition_operator_equals },
		{ id: 'not_contains', label: m.fan_action_flow_condition_operator_not_contains },
		{ id: 'starts_with', label: m.fan_action_flow_condition_operator_starts_with },
		{ id: 'ends_with', label: m.fan_action_flow_condition_operator_ends_with }
	] as const satisfies ReadonlyArray<{ id: ConditionOperator; label: () => string }>);

	function createId(prefix: string) {
		return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
	}

	function createRule(overrides: Partial<ConditionRule> = {}): ConditionRule {
		return {
			id: createId('rule'),
			fieldId: 'email',
			operator: 'contains',
			value: '',
			...overrides
		};
	}

	function createBlock(overrides: Partial<ConditionBlock> = {}): ConditionBlock {
		return {
			id: createId('block'),
			rules: [createRule()],
			...overrides
		};
	}

	let note = $state('');
	let blocks = $state<ConditionBlock[]>([createBlock()]);

	function operatorLabel(operator: ConditionOperator) {
		return operators.find((item) => item.id === operator)?.label() ?? operator;
	}

	function fieldLabel(fieldId: ConditionFieldId) {
		if (fieldId === 'email') return m.fan_action_flow_condition_field_email();
		return fieldId;
	}

	function fieldInfo(fieldId: ConditionFieldId) {
		if (fieldId === 'email') return m.fan_action_flow_condition_field_email_info();
		return '';
	}

	function addRule(blockId: string) {
		blocks = blocks.map((block) =>
			block.id === blockId ? { ...block, rules: [...block.rules, createRule()] } : block
		);
	}

	function removeRule(blockId: string, ruleId: string) {
		blocks = blocks.map((block) => {
			if (block.id !== blockId || block.rules.length <= 1) return block;
			return { ...block, rules: block.rules.filter((rule) => rule.id !== ruleId) };
		});
	}

	function copyRule(blockId: string, ruleId: string) {
		blocks = blocks.map((block) => {
			if (block.id !== blockId) return block;
			const index = block.rules.findIndex((rule) => rule.id === ruleId);
			if (index === -1) return block;
			const source = block.rules[index];
			const copy = createRule({
				fieldId: source.fieldId,
				operator: source.operator,
				value: source.value
			});
			const rules = [...block.rules];
			rules.splice(index + 1, 0, copy);
			return { ...block, rules };
		});
	}

	function addBlock() {
		blocks = [...blocks, createBlock()];
	}

	function removeBlock(blockId: string) {
		if (blocks.length <= 1) return;
		blocks = blocks.filter((block) => block.id !== blockId);
	}

	function copyBlock(blockId: string) {
		const index = blocks.findIndex((block) => block.id === blockId);
		if (index === -1) return;
		const source = blocks[index];
		const copy = createBlock({
			rules: source.rules.map((rule) =>
				createRule({
					fieldId: rule.fieldId,
					operator: rule.operator,
					value: rule.value
				})
			)
		});
		const next = [...blocks];
		next.splice(index + 1, 0, copy);
		blocks = next;
	}
</script>

{#snippet infoButton(label: string, description: string)}
	<HoverCard.Root openDelay={200} closeDelay={100}>
		<HoverCard.Trigger>
			{#snippet child({ props })}
				<button
					{...props}
					type="button"
					class="inline-flex shrink-0 cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
				>
					<Info class="size-3.5" />
					<span class="sr-only">{label}</span>
				</button>
			{/snippet}
		</HoverCard.Trigger>
		<HoverCard.Content side="left" class="w-56">
			<div class="space-y-1">
				<h4 class="text-sm font-semibold">{label}</h4>
				<p class="text-sm text-muted-foreground">{description}</p>
			</div>
		</HoverCard.Content>
	</HoverCard.Root>
{/snippet}

<div class="space-y-6">
	<div class="space-y-2">
		<Label class={labelClass} for="condition-note">{m.fan_action_flow_email_note_label()}</Label>
		<Input
			bind:value={note}
			id="condition-note"
			class={fieldClass}
			placeholder={m.fan_action_flow_email_note_placeholder()}
		/>
	</div>

	<section class="space-y-4">
		<h3 class={sectionTitleClass}>{m.fan_action_flow_condition_rules_title()}</h3>

		<div class="space-y-4">
			{#each blocks as block, blockIndex (block.id)}
				<div class={blockClass}>
					<div class="flex items-center justify-between gap-2">
						<p class="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
							{m.fan_action_flow_condition_block({ number: blockIndex + 1 })}
						</p>
						<div class="flex items-center gap-1">
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								class="text-muted-foreground"
								onclick={() => copyBlock(block.id)}
								aria-label={m.fan_action_flow_condition_copy_block()}
							>
								<Copy class="size-4" />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								class="text-muted-foreground"
								disabled={blocks.length <= 1}
								onclick={() => removeBlock(block.id)}
								aria-label={m.fan_action_flow_condition_delete_block()}
							>
								<Trash2 class="size-4" />
							</Button>
						</div>
					</div>

					<div class="space-y-0">
						{#each block.rules as rule, ruleIndex (rule.id)}
							{#if ruleIndex > 0}
								<div class="flex items-stretch gap-3 py-2 pl-4">
									<div class="flex w-5 flex-col items-center">
										<div class="h-3 w-px bg-border"></div>
										<div class="flex items-center gap-1 py-1">
											<span class="text-xs font-semibold text-workflow-operator">
												{m.fan_action_flow_condition_connector_or()}
											</span>
											{@render infoButton(
												m.fan_action_flow_condition_connector_or(),
												m.fan_action_flow_condition_connector_or_info()
											)}
										</div>
									</div>
								</div>
							{/if}

							<div class={ruleClass}>
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-1.5">
										<span class="text-sm font-medium text-foreground">
											{fieldLabel(rule.fieldId)}
										</span>
										{@render infoButton(fieldLabel(rule.fieldId), fieldInfo(rule.fieldId))}
									</div>
									<div class="flex items-center gap-1">
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											class="text-muted-foreground"
											onclick={() => copyRule(block.id, rule.id)}
											aria-label={m.fan_action_flow_condition_copy_rule()}
										>
											<Copy class="size-4" />
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											class="text-muted-foreground"
											disabled={block.rules.length <= 1}
											onclick={() => removeRule(block.id, rule.id)}
											aria-label={m.fan_action_flow_condition_delete_rule()}
										>
											<X class="size-4" />
										</Button>
									</div>
								</div>

								<div class="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)]">
									<Select.Root type="single" bind:value={rule.operator}>
										<Select.Trigger class={selectTriggerClass}>
											{operatorLabel(rule.operator)}
										</Select.Trigger>
										<Select.Content>
											<Select.Group>
												{#each operators as operator (operator.id)}
													<Select.Item value={operator.id} label={operator.label()}>
														{operator.label()}
													</Select.Item>
												{/each}
											</Select.Group>
										</Select.Content>
									</Select.Root>
									<Input
										bind:value={rule.value}
										class={fieldClass}
										placeholder={m.fan_action_flow_condition_value_placeholder()}
									/>
								</div>
							</div>
						{/each}
					</div>

					<Button
						type="button"
						variant="outline"
						class="w-full border-workflow-operator text-workflow-operator hover:bg-workflow-operator/10"
						onclick={() => addRule(block.id)}
					>
						<Plus class="size-4" />
						{m.fan_action_flow_condition_add_rule_or()}
					</Button>
				</div>
			{/each}
		</div>

		<Button
			type="button"
			variant="outline"
			class="w-full border-workflow-trigger text-workflow-trigger hover:bg-workflow-trigger/10"
			onclick={addBlock}
		>
			<Plus class="size-4" />
			{m.fan_action_flow_condition_add_block_and()}
		</Button>
	</section>
</div>

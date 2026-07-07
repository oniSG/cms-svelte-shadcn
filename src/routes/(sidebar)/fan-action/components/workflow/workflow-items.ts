import type { Component } from 'svelte';
import Mail from '@lucide/svelte/icons/mail';
import type { WorkflowPaletteItem } from './types';
import type { WorkflowPaletteSection } from './node-styles';
import { workflowTriggerDefinition, workflowTriggerPaletteGroups } from './trigger-items';
import { workflowBlockDefinition, workflowBlockDefinitions } from './block-items';
import * as m from '$lib/paraglide/messages.js';

type WorkflowItemDefinition = {
	icon: Component;
	iconModifier?: string;
	label: () => string;
	description: () => string;
	drawerTitle?: () => string;
};

function triggerAsItem(id: string): WorkflowItemDefinition | undefined {
	const trigger = workflowTriggerDefinition(id);
	if (!trigger) return undefined;
	return {
		icon: trigger.icon,
		iconModifier: trigger.iconModifier,
		label: trigger.label,
		description: trigger.description,
		drawerTitle: trigger.drawerTitle
	};
}

function blockAsItem(id: string): WorkflowItemDefinition | undefined {
	const block = workflowBlockDefinition(id);
	if (!block) return undefined;
	return {
		icon: block.icon,
		label: block.label,
		description: block.description,
		drawerTitle: block.drawerTitle
	};
}

function workflowItemDefinition(itemId: string): WorkflowItemDefinition | undefined {
	return triggerAsItem(itemId) ?? blockAsItem(itemId);
}

export function workflowDrawerTitle(itemId: string): string {
	const item = workflowItemDefinition(itemId);
	if (item?.drawerTitle) return item.drawerTitle();
	return workflowItemLabel(itemId);
}

export function workflowItemLabel(itemId: string): string {
	return workflowItemDefinition(itemId)?.label() ?? itemId;
}

export function workflowItemDescription(itemId: string): string {
	return workflowItemDefinition(itemId)?.description() ?? '';
}

export function workflowItemIcon(itemId: string): Component {
	return workflowItemDefinition(itemId)?.icon ?? Mail;
}

export function workflowItemIconModifier(itemId: string): string | undefined {
	return workflowItemDefinition(itemId)?.iconModifier;
}

export type WorkflowPaletteSectionConfig = {
	id: WorkflowPaletteSection;
	label: string;
	items: WorkflowPaletteItem[];
};

export function workflowOperatorPaletteItems(): WorkflowPaletteItem[] {
	return workflowBlockDefinitions
		.filter((block) => block.paletteSection === 'operators')
		.map((block) => ({
			id: block.id,
			variant: block.variant,
			incomplete: block.incomplete
		}));
}

export function workflowActionPaletteItems(): WorkflowPaletteItem[] {
	return workflowBlockDefinitions
		.filter((block) => block.paletteSection === 'actions')
		.map((block) => ({
			id: block.id,
			variant: block.variant,
			incomplete: block.incomplete
		}));
}

export function workflowPaletteSections(): WorkflowPaletteSectionConfig[] {
	return [
		{
			id: 'triggers',
			label: m.fan_action_flow_tab_triggers(),
			items: workflowTriggerPaletteGroups().flatMap((group) => group.items)
		},
		{
			id: 'operators',
			label: m.fan_action_flow_section_operators(),
			items: workflowOperatorPaletteItems()
		},
		{
			id: 'actions',
			label: m.fan_action_flow_tab_actions(),
			items: workflowActionPaletteItems()
		}
	];
}

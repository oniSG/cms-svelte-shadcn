import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../../../shared/types';
import WaitSheetContent from './wait.svelte';

export const operatorSheetRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	wait: WaitSheetContent
};

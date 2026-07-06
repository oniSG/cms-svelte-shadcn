import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../../types';
import WaitDrawerContent from './wait.svelte';

export const operatorDrawerRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {
	wait: WaitDrawerContent
};

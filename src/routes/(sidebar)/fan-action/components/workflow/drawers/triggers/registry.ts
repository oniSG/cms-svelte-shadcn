import type { Component } from 'svelte';
import type { WorkflowDrawerContentProps } from '../../types';

export const triggerDrawerRegistry: Record<string, Component<WorkflowDrawerContentProps>> = {};

export type WorkflowConditionBranch = 'yes' | 'no';

export const workflowConditionBranchStyles = {
	yes: {
		port: '!bg-success',
		stroke: 'var(--success)',
		button:
			'bg-success/10 text-success hover:bg-success/20 dark:bg-success/20 dark:hover:bg-success/30 border-success/25 dark:border-success/30'
	},
	no: {
		port: '!bg-destructive',
		stroke: 'var(--destructive)',
		button:
			'bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 border-destructive/25 dark:border-destructive/30'
	}
} as const satisfies Record<
	WorkflowConditionBranch,
	{ port: string; stroke: string; button: string }
>;

export function workflowConditionBranchStyle(branch: WorkflowConditionBranch | null) {
	if (!branch) return null;
	return workflowConditionBranchStyles[branch];
}

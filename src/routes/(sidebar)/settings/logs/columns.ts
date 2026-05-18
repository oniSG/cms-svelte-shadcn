import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableColumnHeader from './components/data-table-column-header.svelte';
import { data } from './data';


export const emails: { value: string; label: string }[] = data.map(log => ({ value: log.email, label: log.email })).filter((item, index, self) => self.findIndex(i => i.value === item.value) === index);

export type ActionType =
    | 'login'
    | 'action_test'
    | 'action_run'
    | 'action_scenario_edit'
    | 'action_edit'
    | 'action_delete'
    | 'action_duplicate'
    | 'action_archive'
    | 'action_auto_stop'
    | 'visitor_edit'
    | 'user_edit'
    | 'lock_acquired'
    | 'lock_released'
    | 'lock_force_released';

export type Log = {
    id: string;
    user_id: string;
    email: string;
    type: ActionType;
    time: Date;
    data: object;
};

export const types: { label: string, value: ActionType }[] = [
    { label: 'Login', value: 'login' },
    { label: 'Action Test', value: 'action_test' },
    { label: 'Action Run', value: 'action_run' },
    { label: 'Action Scenario Edit', value: 'action_scenario_edit' },
    { label: 'Action Edit', value: 'action_edit' },
    { label: 'Action Delete', value: 'action_delete' },
    { label: 'Action Duplicate', value: 'action_duplicate' },
    { label: 'Action Archive', value: 'action_archive' },
    { label: 'Action Auto Stop', value: 'action_auto_stop' },
    { label: 'Visitor Edit', value: 'visitor_edit' },
    { label: 'User Edit', value: 'user_edit' },
    { label: 'Lock Acquired', value: 'lock_acquired' },
    { label: 'Lock Released', value: 'lock_released' },
    { label: 'Lock Force Released', value: 'lock_force_released' }
];

export const columns: ColumnDef<Log>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return renderComponent(DataTableColumnHeader, {
                column,
                title: 'ID',
            });
        },
    },
    {
        accessorKey: 'type',
        header: ({ column }) => {
            return renderComponent(DataTableColumnHeader, {
                column,
                title: 'Type',
            });
        },
        filterFn: (row, id, value: string[]) => {
            if (!value?.length) return true;
            return value.includes(row.getValue(id) as string);
        }
    },
    {
        accessorKey: 'user_id',
        header: ({ column }) => {
            return renderComponent(DataTableColumnHeader, {
                column,
                title: 'User ID',
            });
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return renderComponent(DataTableColumnHeader, {
                column,
                title: 'Email',
            });
        },
    },
    {
        accessorKey: 'time',
        header: ({ column }) => {
            return renderComponent(DataTableColumnHeader, {
                column,
                title: 'Time',
            });
        },
        filterFn: (row, id, value: [Date, Date | undefined]) => {
            const time = row.getValue(id) as Date;
            const [from, to] = value;
            if (time < from) return false;
            if (to && time > to) return false;
            return true;
        }
    }
];

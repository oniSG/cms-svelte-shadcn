import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableColumnHeader from './components/data-table-column-header.svelte';
import { data } from './data';
import { SvelteSet } from 'svelte/reactivity';

export type Event = {
    id: number,
    event: string,
    label: string,
    name: string,
    time: Date,
    active: boolean,
}

export const tags: string[] = [
    "VIP-gold",
    "VIP-silver",
    "normal",
    "premium",
    "denis"
]

export const users = new SvelteSet(data.map(event => event.name));

export const columns: ColumnDef<Event>[] = [
    {
        accessorKey: 'event',
        header: ({ column }) => {
            return renderComponent(DataTableColumnHeader, {
                column,
                title: 'Event',
            });
        },
    },
    {
        accessorKey: 'label',
        header: ({ column }) => {
            return renderComponent(DataTableColumnHeader, {
                column,
                title: 'Label',
            });
        },
        filterFn: (row, id, value: string[]) => {
            if (!value?.length) return true;
            return value.includes(row.getValue(id) as string);
        }
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return renderComponent(DataTableColumnHeader, {
                column,
                title: 'Creator Name',
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
    },
    {
        accessorKey: 'active',
        header: ({ column }) => {
            return renderComponent(DataTableColumnHeader, {
                column,
                title: 'Active',
            });
        },
    },
];

import type { Module } from '$lib/types/sidebar';

export const moduleState = $state<{ current: Module }>({ current: 'fans' });

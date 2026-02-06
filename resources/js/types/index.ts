export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

declare module '@inertiajs/core' {
    export interface PageProps {
        routes: Record<string, (...args: any[]) => string>;
        // другие ваши пропсы
    }
}

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

interface TableColumn {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'date' | 'custom';
    sortable?: boolean;
    render?: (row: any) => React.ReactNode;
}

export default function DataTable({
    data,
    columns = [],
    resourceName = '',
    singularRName = '',
    routeName = '',
    filters = {},
    viewRoute = '',
    canViewResourse = false,
    canCreateResource = false,
    canEditResource = false,
    canDeleteResource = false,
    icon: Icon,
    createRoute = '',
    editRoute = '',
    onDelete,
}: {
    data: any;
    columns: TableColumn[];
    resourceName: string;
    singularRName: string;
    routeName: string;
    filters: any;
    viewRoute: string;
    canViewResourse: boolean;
    canCreateResource: boolean;
    canEditResource: boolean;
    canDeleteResource: boolean;
    icon: React.ElementType;
    createRoute: string;
    editRoute: string;
    onDelete: (id: string) => void;
}) {
    const errors = usePage().props.errors;
    const [perPage, setPerPage] = useState(filters?.perPage || 10);
    const [sort, setSort] = useState(filters?.sort || 'id');
    const [direction, setDirection] = useState(filters?.direction || 'desc');

    const [itemToDelete, setItemToDelete] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const updateRoute = (newParams = {}) => {
        const params = {
            search,
            perPage,
            sort,
            direction,
            page: 1,
            ...newParams,
        };

        router.get(route(routeName), params, {
            preserveState: true,
            preserveScroll: true,
        });

        const handleSearch = (e: any) => {
            e.preventDefault();
            updateRoute();
        };

        const handlePerPageChange = (e: any) => {
            const newPerPage = e.target.value;
            setPerPage(newPerPage);
            updateRoute({ perPage: newPerPage });
        };

        const handleSortChange = (column: any) => {
            const newDirection =
                sort === column && direction === 'asc' ? 'desc' : 'asc';
            setSort(column);
            setDirection(newDirection);
            updateRoute({ sort: column, direction: newDirection });
        };

        const formatDate = (dateString: string) => {
            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            };
            return new Date(dateString).toLocaleDateString('en-US', options);
        };

        const formatDate2 = (dateString: string) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zerp based
            const day = String(date.getDate()).padStart(2, '0');
            return `${year} - ${month} - ${day}`;
        };

        const renderCell = (item: any, column: any, index: number) => {
            if (!column.key) return null;

            const getValue = (obj: any, path: any) => {
                return path
                    .split('.')
                    .reduce((acc: any, part: any) => acc && acc[part], obj);
            };

            const value = getValue(item, column.key);

            if (column.type === 'date' && value) {
                return formatDate(value);
            }

            if (column.type === 'date2' && value) {
                return formatDate2(value);
            }

            if (column.type === 'bage') {
                return (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {value}
                    </span>
                );
            }

            if (column.type === 'image' && column.design === 'rec') {
                return (
                    <img
                        src={value}
                        className="h-30 w-30"
                        alt={item.name}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/placeholder.png';
                        }}
                    />
                );
            }

            if (column.type === 'boolean') {
                return value ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                        Yes
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                        No
                    </span>
                );
            }

            if (column.type === 'custom' && column.render) {
                return column.render(item);
            }

            if (column.type === 'IndexColumn' && column.render()) {
                return column.render(item, index);
            }

            return value;
        };

        const renderAction = (item: any) => {
            return (
                <div className="flex space-x-2">
                    {canViewResourse && (
                        <button
                            className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                            onClick={() =>
                                router.visit(route(viewRoute, item.id))
                            }
                        >
                            View
                        </button>
                    )}
                    {canEditResource && (
                        <button
                            className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                            onClick={() =>
                                router.visit(route(editRoute, item.id))
                            }
                        >
                            Edit
                        </button>
                    )}
                    {canDeleteResource && (
                        <button
                            className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                            onClick={() => {
                                setItemToDelete(item);
                                setShowDeleteDialog(true);
                            }}
                        >
                            Delete
                        </button>
                    )}
                </div>
            );
        };
    };

    let tableColumns = [...columns];

    if (canEditResource || canDeleteResource || canViewResourse) {
        tableColumns.push({
            key: 'actions',
            label: 'Actions',
            type: 'custom',
            sortable: false,
            render: renderActions,
        });
    }

    return (
        <div className="w-full bg-white dark:bg-gray-900">
            <div className="px-t py-4">

            </div>
        </div>
    );
}

import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import DeleteDialog from '@/components/DeleteDialog';

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
    const { routes } = usePage().props;
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

        // router.get(route(routeName), params, {
        router.get(routes[routeName](), params, {
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
                                // router.visit(route(viewRoute, item.id))
                                router.visit(routes[viewRoute]({ id: item.id }))
                            }
                        >
                            View
                        </button>
                    )}
                    {canEditResource && (
                        <button
                            className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                            onClick={() =>
                                // router.visit(route(editRoute, item.id))
                                router.visit(routes[editRoute]({ id: item.id }))
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
            <div className="px-6 py-4">
                <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="flex items-center">
                        {Icon && (
                            <Icon className="mr-3 h-6 w-6 text-blue-600 dark:text-blue-400" />
                        )}
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            {resourceName}
                        </h2>
                    </div>
                    {canCreateResource && (
                        <a
                            href={routes[createRoute]()}
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                            Add {singularRName}
                        </a>
                    )}
                </div>

                <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <form
                        onSubmit={handleSearch}
                        className="flew relative w-full max-w-md"
                    >
                        <input
                            type="text"
                            placeholder={`Search...`}
                            className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <button
                            type="submit"
                            className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-800"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex items-center">
                        <label
                            htmlFor="perPage"
                            className="mr-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                        >
                            Show
                        </label>
                        <select
                            id="perPage"
                            className="rounded-lg border border-gray-300 bg-white py-2 pr-8 pl-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            value={perPage}
                            onChange={handlePerPageChange}
                        >
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 shadow dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800">
                                {tableColumns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                        style={
                                            column.width
                                                ? { width: column.width }
                                                : {}
                                        }
                                    >
                                        {column.sortable !== false ? (
                                            <button
                                                className="group inline-flex items-center"
                                                onClick={() =>
                                                    handleSort(column.key)
                                                }
                                            >
                                                {column.label}
                                                <span className="ml-2">
                                                    {sort === column.key ? (
                                                        direction === 'asc' ? (
                                                            <ArrowUp className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                                        ) : (
                                                            <ArrowDown className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                                        )
                                                    ) : (
                                                        <span>
                                                            <ArrowUp className="h-4 w-4" />
                                                        </span>
                                                    )}
                                                </span>
                                            </button>
                                        ) : (
                                            column.label
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {data.data.length > 0 ? (
                                data.data.map((item: any, index: number) => (
                                    <tr
                                        key={item.id}
                                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        {tableColumns.map((column) => (
                                            <td
                                                key={`${item.id}-${column.key}`}
                                                className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300"
                                            >
                                                {renderCell(
                                                    item,
                                                    column,
                                                    index,
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={tableColumns.length}
                                        className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            {Icon && (
                                                <Icon className="mb-2 h-10 w-10 text-gray-400 dark:text-gray-600" />
                                            )}
                                            <p className="font-medium">
                                                No {resourceName.toLowerCase()}{' '}
                                                found
                                            </p>
                                            <p className="mt-1 text-gray-400 dark:text-gray-500">
                                                Try adjusting your search
                                                criteria
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/*Pagination section*/}
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing{' '}
                        <span className="font-medium">{data.from}||0</span> to{' '}
                        <span className="font-medium">{data.to}||0</span> of{' '}
                        <span className="font-medium">{data.total}</span>{' '}
                        results
                    </p>

                    <div className="flex items-center space-x-1">
                        <button className="disabled: relative inline-flex items-center rounded-md border border-gray-300 bg-white px-1 py-2 text-sm font-medium text-gray-700 opacity-50 hover:bg-gray-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {data.links &&
                            data.links.map((link: any, index: number) => {
                                if (
                                    link.lable.includes('Previous') ||
                                    link.lable.includes('Next')
                                ) {
                                    return null;
                                }

                                const pageNum = parseInt(link.label);
                                if (
                                    isNaN(pageNum) &&
                                    link.label.includes('...')
                                ) {
                                    return (
                                        <span
                                            key={index}
                                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={index}
                                        className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${link.active} ? 'bg-blue-600 dark:bg-blue-700' : ' dark:hover:bg-gray-700'} border border-gray-300 bg-white text-gray-700 text-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300`}
                                        onClick={() => router.visit(link.url)}
                                        disabled={!link.url}
                                    >
                                        {pageNum || link.label}
                                    </button>
                                );
                            })}
                        <button
                            onClick={() =>
                                data.next_page_url &&
                                router.visit(data.next_page_url)
                            }
                            disabled={!data.next_page_url}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            <DeleteDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={() => onDelete(itemToDelete?.id)}
                message={`Are you sure you want to delete this ${resourceName.toLowerCase()}? This action cannot be undone`}
                // title={`Delete Item`}
                title={`Delete ${resourceName.toLowerCase()}`}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
            />
        </div>
    );
}

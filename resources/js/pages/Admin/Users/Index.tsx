import { Head, router, usePage } from '@inertiajs/react';
import Layout from '@/layouts/app-layout';
import DataTable from '@/components/DataTables/DataTable';
import { TableColumn } from '@/components/DataTables/TableColumn.interface';
import {
    create,
    destroy,
    edit,
    show,
} from '@/actions/App/Http/Controllers/Admin/UserController';
import { Users } from 'lucide-react';

export default function UserIndex() {
    const { users, filters, can } = usePage().props;
    const columns: TableColumn[] = [
        {
            key: 'index',
            label: '#',
            sortable: false,
            type: 'IndexColumn',
            width: '80px',
            render: (item: any, index: number) => {
                return (filters.page - 1) * filters.perPage + index + 1;
            },
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
        },
        {
            key: 'phone',
            label: 'Phone',
            sortable: true,
        },
        {
            key: 'created_at',
            label: 'Created At',
            sortable: true,
        },
    ];

    function handleDelete(id: string) {
        router.delete(destroy(id), {
            preserveScroll: true,
            onSuccess: () => {
                // toast.success('User deleted successfully');
            },
            onError: () => {
                // toast.error('User deletion failed');
            },
        });
    }

    return (
        <Layout>
            <Head title="Users" />
            <h1>Test Users</h1>
            <div className="py-6">
                <div className="mx-auto">
                    <DataTable
                        data={users}
                        columns={columns}
                        resourceName="Users"
                        singularRName="User"
                        routeName="admin.users.index"
                        filters={filters}
                        canViewResource={false}
                        canCreateResource={false}
                        canEditResource={false}
                        canDeleteResource={true}
                        icon={Users}
                        viewRoute="admin.users.show"
                        editRoute="admin.users.edit"
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </Layout>
    );
}

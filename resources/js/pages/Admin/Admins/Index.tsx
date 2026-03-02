import { Head, router, usePage } from '@inertiajs/react';
import { Users } from 'lucide-react';
import DataTable from '@/components/DataTables/DataTable';
import type { TableColumn } from '@/components/DataTables/TableColumn.interface';
import Layout from '@/layouts/app-layout';
import { index, destroy, create, show, edit } from '@/routes/admin/admins';

export default function AdminsIndex() {
    const { admins, filters, can } = usePage().props;
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
            key: 'avatar',
            label: 'Avatar',
            sortable: false,
            type: 'image',
            design:  'rec',
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

    console.log({ admins });
    return (
        <Layout>
            <Head title="Admins" />
            <div className="py-6">
                <div className="mx-auto">
                    <DataTable
                        data={admins}
                        columns={columns}
                        resourceName="Admins"
                        singularRName="Admin"
                        routeName={index().url}
                        filters={filters}
                        canViewResource={true}
                        canCreateResource={true}
                        canEditResource={true}
                        canDeleteResource={true}
                        icon={Users}
                        viewRoute={show}
                        createRoute={create}
                        editRoute={edit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </Layout>
    );
}

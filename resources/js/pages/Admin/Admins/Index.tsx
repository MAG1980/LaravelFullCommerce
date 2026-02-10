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

export default function UserIndex() {


    return (
        <Layout>
            <Head title="Admin Dashboard" />
            <h1>Test Admins</h1>
        </Layout>
    );
}

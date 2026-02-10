export interface TableColumn {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'date' | 'custom';
    sortable?: boolean;
    render?: (row: any) => React.ReactNode;
}

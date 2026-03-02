import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ImageIcon, Lock,
    Mail, Phone,
    Save,
    Trash2,
    Upload,
    User,
    UserCheck
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/Progress';
import AppLayout from '@/layouts/app-layout';
import { index as adminsIndex, store as adminsStore } from '@/routes/admin/admins';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: 'dashboard' },
    { title: 'Admins', href: adminsIndex().url },
    { title: 'Create Admin', href: '' }
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        username:'',
        password: '',
        password_confirmation: '',
        avatar: null as File | null
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsUploading(true);

        /*        // Convert string to number or null just before sending
                const normalizedParentId =
                    data.parent_id === null || data_parent_id === 'none'
                        ? null
                        : Number(data.parent_id);*/

        post(adminsStore().url, {
            ...data,
            preserveScroll: true,
            onProgress: (progress) => {
                if (progress?.percentage) {
                    setUploadProgress(progress.percentage);
                }
            },
            onSuccess: () => {
                setIsUploading(false);
                setUploadProgress(0);
            },
            onError: () => {
                setIsUploading(false);
                setUploadProgress(0);
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setData('avatar', file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };

            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setData('avatar', null);
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current = null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Admin" />
            <h1>Create Admin</h1>
            <div
                className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 dark:from-gray-900 dark:to-gray-800">
                <Card className="overflow-hidden border-none bg-white shadow-xl dark:bg-gray-800">
                    <CardHeader>
                        <div
                            className="to-gray-10 min-h-screen bg-gradient-to-br from-gray-50 p-4 sm:p-6 lg:p-8 dark:from-gray-900 dark:to-gray-800">
                            <Card className="overflow-hidden border-none bg-white shadow-xl dark:bg-gray-800">
                                <CardHeader>
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="rounded-xl bg-primary/20 p-3 shadow-sm backdrop-blur-sm dark:bg-primary/30">
                                                <User
                                                    className="dark:text-primary-light text-primary"
                                                    size={24}
                                                />
                                            </div>
                                            <div>
                                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                    Create Admin
                                                </h1>
                                            </div>
                                        </div>

                                        <Link href={adminsIndex()}>
                                            <Button
                                                className="flex items-center gap-2 text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <ArrowLeft size={16} />
                                                Back
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <form
                                        className="p-6"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="mx-auto max-w-xl space-y-6">
                                            <div className="space-y-2">
                                                <Label
                                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                    htmlFor="name"
                                                >
                                                    <User
                                                        className="dark:text-primary-light text-primary"
                                                        size={14}
                                                    />
                                                    Name
                                                </Label>

                                                <div className="group relative">
                                                    <Input
                                                        id="name"
                                                        className="dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 pl-10 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                                        name="name"
                                                        value={data.name}
                                                        onChange={(e) => {
                                                            setData(
                                                                'name',
                                                                e.target.value
                                                            );
                                                        }}
                                                        placeholder="Enter name"
                                                        required={true}
                                                        autoFocus={true}
                                                    />
                                                    <User
                                                        className="dark:group-hover:text-primay-light absolute top-1/6 left-3 translate-y-1/2 text-gray-400 transition-colors group-hover:text-primary dark:text-gray-500"
                                                        size={18}
                                                    />
                                                </div>

                                                {errors.name && (
                                                    <div
                                                        className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                        <AlertCircle
                                                            size={14}
                                                        />
                                                        <span>
                                                            {errors.name}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                    htmlFor="username"
                                                >
                                                    <UserCheck
                                                        className="dark:text-primary-light text-primary"
                                                        size={14}
                                                    />
                                                    Username
                                                </Label>

                                                <div className="group relative">
                                                    <Input
                                                        id="username"
                                                        className="dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 pl-10 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                                        name="username"
                                                        value={data.username}
                                                        onChange={(e) => {
                                                            setData(
                                                                'username',
                                                                e.target.value
                                                            );
                                                        }}
                                                        placeholder="Enter username"
                                                        required={true}
                                                        autoFocus={true}
                                                    />
                                                    <User
                                                        className="dark:group-hover:text-primay-light absolute top-1/6 left-3 translate-y-1/2 text-gray-400 transition-colors group-hover:text-primary dark:text-gray-500"
                                                        size={18}
                                                    />
                                                </div>

                                                {errors.username && (
                                                    <div
                                                        className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                        <AlertCircle
                                                            size={14}
                                                        />
                                                        <span>
                                                            {errors.username}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                    htmlFor="email"
                                                >
                                                    <Mail
                                                        className="dark:text-primary-light text-primary"
                                                        size={14}
                                                    />
                                                    Email
                                                </Label>

                                                <div className="group relative">
                                                    <Input
                                                        id="email"
                                                        className="dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 pl-10 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                                        name="email"
                                                        value={data.email}
                                                        onChange={(e) => {
                                                            setData(
                                                                'email',
                                                                e.target.value
                                                            );
                                                        }}
                                                        placeholder="Enter email"
                                                        required={true}
                                                        autoFocus={true}
                                                    />
                                                    <Mail
                                                        className="dark:group-hover:text-primay-light absolute top-1/6 left-3 translate-y-1/2 text-gray-400 transition-colors group-hover:text-primary dark:text-gray-500"
                                                        size={18}
                                                    />
                                                </div>

                                                {errors.email && (
                                                    <div
                                                        className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                        <AlertCircle
                                                            size={14}
                                                        />
                                                        <span>
                                                            {errors.email}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                    htmlFor="phone"
                                                >
                                                    <Phone
                                                        className="dark:text-primary-light text-primary"
                                                        size={14}
                                                    />
                                                    Phone Number
                                                </Label>

                                                <div className="group relative">
                                                    <Input
                                                        id="phone"
                                                        className="dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 pl-10 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                                        name="phone"
                                                        value={data.phone}
                                                        onChange={(e) => {
                                                            setData(
                                                                'phone',
                                                                e.target.value
                                                            );
                                                        }}
                                                        placeholder="Enter phone number"
                                                        required={true}
                                                        autoFocus={true}
                                                    />
                                                    <Phone
                                                        className="dark:group-hover:text-primay-light absolute top-1/6 left-3 translate-y-1/2 text-gray-400 transition-colors group-hover:text-primary dark:text-gray-500"
                                                        size={18}
                                                    />
                                                </div>

                                                {errors.phone && (
                                                    <div
                                                        className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                        <AlertCircle
                                                            size={14}
                                                        />
                                                        <span>
                                                            {errors.phone}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>


                                            <div className="space-y-2">
                                                <Label
                                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                    htmlFor="password"
                                                >
                                                    <Lock
                                                        className="dark:text-primary-light text-primary"
                                                        size={14}
                                                    />
                                                    Password
                                                </Label>

                                                <div className="group relative">
                                                    <Input
                                                        id="password"
                                                        className="dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 pl-10 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                                        name="password"
                                                        type="password"
                                                        value={data.password}
                                                        onChange={(e) => {
                                                            setData(
                                                                'password',
                                                                e.target.value
                                                            );
                                                        }}
                                                        placeholder="Enter password"
                                                        required={true}
                                                        autoFocus={true}
                                                    />
                                                    <Lock
                                                        className="dark:group-hover:text-primay-light absolute top-1/6 left-3 translate-y-1/2 text-gray-400 transition-colors group-hover:text-primary dark:text-gray-500"
                                                        size={18}
                                                    />
                                                </div>

                                                {errors.password && (
                                                    <div
                                                        className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                        <AlertCircle
                                                            size={14}
                                                        />
                                                        <span>
                                                            {errors.password}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                    htmlFor="password_confirmation"
                                                >
                                                    <Lock
                                                        className="dark:text-primary-light text-primary"
                                                        size={14}
                                                    />
                                                    Password confirmation
                                                </Label>

                                                <div className="group relative">
                                                    <Input
                                                        id="password_confirmation"
                                                        className="dark:focus:border-primary-light dark:focus:ring-primary-light/20 h-12 w-full rounded-lg border border-gray-200 bg-white/80 pl-10 text-base text-gray-900 shadow-sm backdrop-blur-sm transition-all group-hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:group-hover:border-gray-500"
                                                        name="password_confirmation"
                                                        type="password"
                                                        value={data.password_confirmation}
                                                        onChange={(e) => {
                                                            setData(
                                                                'password_confirmation',
                                                                e.target.value
                                                            );
                                                        }}
                                                        placeholder="Enter password confirmation"
                                                        required={true}
                                                        autoFocus={true}
                                                    />
                                                    <Lock
                                                        className="dark:group-hover:text-primay-light absolute top-1/6 left-3 translate-y-1/2 text-gray-400 transition-colors group-hover:text-primary dark:text-gray-500"
                                                        size={18}
                                                    />
                                                </div>

                                                {errors.password_confirmation && (
                                                    <div
                                                        className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                        <AlertCircle
                                                            size={14}
                                                        />
                                                        <span>
                                                            {errors.password_confirmation}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>


                                            <div className="space-y-2">
                                                <Label
                                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                                                    htmlFor="image"
                                                >
                                                    <ImageIcon
                                                        className="dark:text-primary-light text-primary"
                                                        size={14}
                                                    />
                                                    Admin Avatar
                                                </Label>

                                                <div className="group relative">
                                                    {!imagePreview ? (
                                                        <div
                                                            className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white/200 p-4 text-center transition-all hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800/80 dark:hover:border-gray-500"
                                                            onClick={() =>
                                                                fileInputRef.current?.click()
                                                            }
                                                        >
                                                            <Upload
                                                                className="mb-2 text-gray-400 dark:text-gray-500"
                                                                size={24}
                                                            />
                                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                Click to upload
                                                            </p>
                                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                PNG, JPG, GIF up
                                                                to 5MB
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="relative h-40 w-full overflow-hidden rounded-lg border border-gray-200 bg-white/80 transition-all dark:border-gray-600 dark:bg-gray-800/80">
                                                            <img
                                                                className="h-full w-full object-cover"
                                                                src={
                                                                    imagePreview
                                                                }
                                                                alt="Category preview"
                                                            />
                                                            <div
                                                                className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all hover:bg-black/40">
                                                                <div className="flex gap-2 opacity-0 hover:opacity-100">
                                                                    <Button
                                                                        className="rounded-full"
                                                                        type="button"
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            fileInputRef.current?.click()
                                                                        }
                                                                    >
                                                                        <Upload
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </Button>
                                                                    <Button
                                                                        className="rounded-full"
                                                                        type="button"
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        onClick={
                                                                            clearImage
                                                                        }
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <Input
                                                        className="hidden"
                                                        ref={fileInputRef}
                                                        type="file"
                                                        id="image"
                                                        name="image"
                                                        accept="image/*"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                    />
                                                </div>

                                                {isUploading && data.avatar && (
                                                    <div className="mt-2">
                                                        <Progress
                                                            className="h-2 w-full bg-gray-200 dark:bg-gray-700"
                                                            value={
                                                                uploadProgress
                                                            }
                                                        />
                                                        <p className="mt-1 text-xs text-gray-50 dark:text-gray-400">
                                                            {uploadProgress}%
                                                            uploaded
                                                        </p>
                                                    </div>
                                                )}

                                                {errors.avatar && (
                                                    <div
                                                        className="mt-2 flex items-center gap-2 rounded-md bg-red-50 p-2 text-red-500 dark:bg-red-900/20 dark:text-red-400">
                                                        <AlertCircle
                                                            size={14}
                                                        />
                                                        <span>
                                                            {errors.avatar}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-4">
                                                <Button
                                                    className="w-full"
                                                    type="submit"
                                                    disabled={processing}
                                                >
                                                    <Save
                                                        className="mr-2"
                                                        size={16}
                                                    />
                                                    Save Admin
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </AppLayout>
    );
}

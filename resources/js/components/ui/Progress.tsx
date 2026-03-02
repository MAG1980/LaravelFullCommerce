import { clsx } from 'clsx';

export function Progress({
    value = 0,
    className,
}: {
    value?: number;
    className?: string;
}) {
    return (
        <div
            className={clsx(
                'relative h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-700',
                className,
            )}
        >
            <div
                className="dark:bg-primary-light absolute top-0 left-0 h-full bg-primary transition-all duration-300"
                style={{ width: `${value}%` }}
            ></div>
        </div>
    );
}

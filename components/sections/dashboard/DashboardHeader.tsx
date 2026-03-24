export default function DashboardHeader({ title, description }: { title: string, description: string }) {
    return (
        <div className="space-y-3 mt-6 lg:mt-0">
            <h1 className='text-3xl sm:text-4xl font-bold'>
                {title}
            </h1>
            <p className="text-muted-foreground text-md max-w-xl tracking-normal">
                {description}
            </p>
        </div>
    )
}

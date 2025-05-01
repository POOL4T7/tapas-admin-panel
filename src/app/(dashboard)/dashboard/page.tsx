export default function DashboardPage() {
  return (
    <>
      <div className='space-y-4'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Welcome to your admin dashboard. This is a sample page to demonstrate
          the layout.
        </p>

        {/* Sample Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {['Total Users', 'Active Products', 'Monthly Sales', 'Revenue'].map(
            (title) => (
              <div
                key={title}
                className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'
              >
                <h3 className='text-sm font-medium'>{title}</h3>
                <p className='mt-2 text-2xl font-bold'>0</p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MenuIcon } from 'lucide-react';

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-lg'>
      <div className=' flex h-16 items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='icon'
            className='text-black hover:bg-white/10'
            onClick={toggleSidebar}
          >
            <MenuIcon className='h-5 w-5' />
          </Button>
          <span className='hidden text-black text-xl font-bold md:inline-block'>
            Admin Dashboard
          </span>
        </div>

        {/* Moved header options to the end */}
        <div className='flex items-center space-x-4 mr-3'>
          {/* <Button
            variant='ghost'
            size='icon'
            className='text-white hover:bg-white/10 relative'
          >
            <BellIcon className='h-5 w-5' />
            <span className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500'></span>
          </Button> */}
          <div className='flex items-center space-x-2'>
            {/* <div className='text-right hidden md:block'>
              <p className='font-medium'>Admin User</p>
              <p className='text-xs text-white/80'>Super Admin</p>
            </div> */}
            {/* <Avatar className='border-2 border-white/30'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback className='bg-indigo-500'>AD</AvatarFallback>
            </Avatar> */}
          </div>
        </div>
      </div>
    </header>
  );
}

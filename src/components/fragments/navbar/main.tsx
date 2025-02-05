"use client"

import React from "react";
import Image from 'next/image'
import Link from 'next/link'
import { AlignLeftIcon, MoonIcon, SunIcon, User } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuGroup, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu'
import { SheetTrigger } from "@/components/ui/sheet"
import { cn } from '@/lib/utils'
import { useTheme } from "next-themes"
import { useTranslations } from 'next-intl'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@/hooks/useUser'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import '@/lib/utils/string/get-initial-name'

const MainNavbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
    const { theme, setTheme } = useTheme()
    const { toast } = useToast()
    const { user, avatar, isLoggedIn, userRole } = useUser()
    const t = useTranslations()
    const supabase = createClientComponentClient()
    const router = useRouter()

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()

        if (!error) {
            toast({
                description: (
                    <p>{t('ACTION_SUCCESS', { action: t('LOGOUT').toLowerCase() })}</p>
                ),
            })
            router.push('/login')
        }
    }

    return (
        <div className={cn('border-b', className)} {...props} ref={ref} >
            <div className="flex items-center h-16 px-4">
                <nav className="flex items-center space-x-4 lg:space-x-6">
                    <SheetTrigger className="block md:hidden">
                        <AlignLeftIcon className="w-6 h-6" />
                    </SheetTrigger>
                    <Link href="/">
                        <Image src="/images/logo.png" width={180} height={120} alt="Dalkom Kissa" />
                    </Link>
                </nav>
                <div className="flex items-center ml-auto space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                <DropdownMenuRadioItem value="light">{t('LIGHT')}</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="dark">{t('DARK')}</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="system">{t('SYSTEM')}</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={avatar?.publicUrl} alt={'@' + (user?.username)} />
                                        <AvatarFallback>{user?.name.getInitialName()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none truncate">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground truncate">
                                            {'@' + (user?.username)}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {userRole == 'webadmin' ? (
                                        <Link href="/dashboard">
                                            <DropdownMenuItem>
                                                {t('DASHBOARD')}
                                            </DropdownMenuItem>
                                        </Link>
                                    ) : null}
                                    <Link href="/settings">
                                        <DropdownMenuItem>
                                            {t('SETTINGS')}
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    {t('LOGOUT')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button variant="outline">
                                {t('LOGIN')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
})

export { MainNavbar }

MainNavbar.displayName = "MainNavbar"

export default MainNavbar
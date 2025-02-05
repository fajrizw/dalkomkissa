import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Avatar {
    publicUrl: string;
}

export const useUser = () => {
    const supabase = createClientComponentClient()
    const [user, setUser] = useState<any | null>(null)
    const [avatar, setAvatar] = useState<Avatar | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userRole, setUserRole] = useState<string>("user")

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data, error } = await supabase
                    .from('user_profile')
                    .select('*')
                    .eq('account_id', user.id)
                    .single()
                if (!error) {
                    setUser(data)
                    const { data: role } = await supabase
                        .rpc("get_my_claim", {
                            claim: "userrole"
                        })
                    setUserRole(role)
                    const { data: photo } = await supabase
                        .storage
                        .from('avatar')
                        .getPublicUrl(data.photo)
                    setAvatar(photo)
                }
            }
        }

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setIsLoggedIn(true)
                getUser()
            }
        }

        checkSession();
    }, []);

    return { user, avatar, isLoggedIn, userRole };
};
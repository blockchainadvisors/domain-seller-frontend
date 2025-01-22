"use client"

import React, { useEffect, useState } from 'react'
import withPageRequiredAuth from '@/services/auth/with-page-required-auth'
import useAuth from '@/services/auth/use-auth'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useFetch from '@/services/api/use-fetch';
import { API_URL } from '@/services/api/config';

function Settings() {
    const fetch = useFetch();
    const { user } = useAuth();

    const [firstname, setFirstname] = useState<string>((user as any).first_name as string);
    const [lastname, setLastname] = useState<string>((user as any).last_name as string);

    const handleUpdate = async () => {
        try {
            const requestUrl = new URL(`${API_URL}/v1/users/${user?.id}`);

            await fetch(requestUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name: firstname,
                    last_name: lastname
                })
            })

            window.alert("Your profile has been updated!");
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div className='flex flex-col gap-5 mt-5'>
            <h1 className='text-2xl font-bold'>Settings</h1>

            <div className='border border-primary/30 rounded-md p-3'>
                <h4 className='text-lg font-bold'>Profile</h4>

                <div className="flex flex-col gap-5 mt-5">
                    <div className='flex flex-col'>
                        <label className='font-semibold'>Firstname</label>
                        <Input type="text" value={firstname} placeholder="Firstname" onChange={(e) => setFirstname(e.target.value)} />
                    </div>

                    <div className='flex flex-col'>
                        <label className='font-semibold'>Lastname</label>
                        <Input type="text" value={lastname} placeholder="Lastname" onChange={(e) => setLastname(e.target.value)} />
                    </div>

                    <Button className='self-start' onClick={handleUpdate}>Update Information</Button>
                </div>
            </div>
        </div>
    )
}

export default withPageRequiredAuth(Settings)
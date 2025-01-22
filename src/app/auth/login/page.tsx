"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthLoginService } from '@/services/api/services/auth';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import useAuthActions from '@/services/auth/use-auth-actions';
import useAuthTokens from '@/services/auth/use-auth-tokens';
import withPageRequiredGuest from '@/services/auth/with-page-required-guest';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

function Login() {
  const { setUser } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();
  const fetchAuthLogin = useAuthLoginService();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const { data, status } = await fetchAuthLogin({
      email,
      password
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      window.alert("Please check all fields!")
      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      setTokensInfo({
        token: data.token,
        refreshToken: data.refreshToken,
        tokenExpires: data.tokenExpires,
      });
      setUser(data.user);
    }
  }

  useEffect(() => {
    const registerKey = async (e: { key: string }) => {
      if (e.key === "Enter") {
        await handleSubmit();
      }
    }

    window.addEventListener("keydown", registerKey);

    return () => {
      window.removeEventListener("keydown", registerKey);
    }
  }, [email, password]);

  return (
    <div className='px-5 md:px-20'>
      <h1 className='text-3xl font-bold'>Sign In</h1>

      <div className="flex flex-col mt-2">
        <div className='py-2'>
          <label className='text-sm'>Enter Email</label>
          <Input type="email" placeholder="Enter your email..." value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className='py-2'>
          <label className='text-sm'>Enter Password</label>
          <Input type="password" placeholder="Enter your password..." value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-5 items-center justify-between'>
        <Button variant="secondary" className="mt-2" onClick={handleSubmit}>Sign In</Button>
        <p className='text-sm'>Don't have an account? <Link href="/auth/register">Sign Up</Link></p>
      </div>
    </div>
  )
}

export default withPageRequiredGuest(Login);


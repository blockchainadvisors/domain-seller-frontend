"use client";

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthLoginService, useAuthSignUpService } from '@/services/api/services/auth';
import HTTP_CODES_ENUM from '@/services/api/types/http-codes';
import useAuthActions from '@/services/auth/use-auth-actions';
import useAuthTokens from '@/services/auth/use-auth-tokens';
import withPageRequiredGuest from '@/services/auth/with-page-required-guest';
import Link from 'next/link';
import React, { useState } from 'react'

function Register() {
  const { setUser } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();
  const fetchAuthLogin = useAuthLoginService();
  const fetchAuthSignUp = useAuthSignUpService();
  
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      window.alert("Passwords do not match!");
      return;
    }

    const { data: dataSignUp, status: statusSignUp } =
    await fetchAuthSignUp({
        // @ts-ignore
        first_name: firstname,
        last_name: lastname,
        email,
        password,
        policy: []
      });

    if (statusSignUp === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      window.alert("Please check all fields!");
      return;
    }

    const { data: dataSignIn, status: statusSignIn } = await fetchAuthLogin({
      email: email,
      password: password,
    });

    if (statusSignIn === HTTP_CODES_ENUM.OK) {
      setTokensInfo({
        token: dataSignIn.token,
        refreshToken: dataSignIn.refreshToken,
        tokenExpires: dataSignIn.tokenExpires,
      });
      setUser(dataSignIn.user);
    }
  }

  return (
    <div className='px-20'>
      <h1 className='text-3xl font-bold'>Register</h1>

      <div className="flex flex-col mt-2">

        <div className='py-2'>
          <label className='text-sm'>Firstname</label>
          <Input type="text" placeholder="Enter your firstname..." value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        </div>

        <div className='py-2'>
          <label className='text-sm'>Lastname</label>
          <Input type="text" placeholder="Enter your lastname..." value={lastname} onChange={(e) => setLastname(e.target.value)} />
        </div>

        <div className='py-2'>
          <label className='text-sm'>Enter Email</label>
          <Input type="email" placeholder="Enter your email..." value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className='py-2'>
          <label className='text-sm'>Enter Password</label>
          <Input type="password" placeholder="Enter your password..." value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className='py-2'>
          <label className='text-sm'>Enter Confirmation Password</label>
          <Input type="password" placeholder="Enter your confirmation password..." value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <Button variant="secondary" className="mt-2" onClick={handleRegister}>Register</Button>
        <p className='text-sm'>Have an account? <Link href="/auth/login">Sign In</Link></p>
      </div>
    </div>
  )
}

export default withPageRequiredGuest(Register);


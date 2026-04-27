'use client'
import React, { useRef, useState } from 'react'
import Link from 'next/link';
import { Condition } from '../Conditions/Condition';
import '@/public/css/login.css'
import dynamic from 'next/dynamic';
import {  ValidateEmail, ValidatePassword } from '@/utils/validations';
import axios from 'axios';
import { ToastFunction } from '@/utils/toast-function';
// @ts-ignore
import ReCAPTCHA from 'react-google-recaptcha';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const InputEmail = dynamic(()=>import('@/components/inputs/inputField'))
const InputPassword = dynamic(()=>import('@/components/inputs/inputPassword'));

const Login = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [emailError, setEmailError] = useState<string|undefined>('');
    const [passwordError, setPasswordError] = useState<string|undefined>('');

    const [loading , setLoading] = useState(false);
    const captchaRef = useRef<ReCAPTCHA | null>(null);
    const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
    const router = useRouter();


    const ValidateInputData = (email:string, password:string)=>{
        let IsValid = true;

        const ValidatedEmail = ValidateEmail(email);
        const ValidatedPassword = ValidatePassword(password);

        if(!ValidatedEmail.isValid){
            setEmailError(ValidatedEmail.message)
            IsValid = false;
        }else{
            setEmailError('');
        }


        if(!ValidatedPassword.isValid){
            setPasswordError(ValidatedPassword.message)
            IsValid = false;
        }else{
            setPasswordError('')
        }

        const captchaToken = captchaRef.current?.getValue() || '';

        if(!captchaVerified || !captchaToken){
            ToastFunction('error', 'Please complete the CAPTCHA');
            IsValid = false;
        }

        return {IsValid,email:ValidatedEmail.value, password:ValidatedPassword.value, captchaToken};
    }

    const ResetInputData = () =>{
        setUserEmail('');
        setUserPassword('');
        captchaRef.current?.reset();
        setCaptchaVerified(false);
    }
    

    const handleLoginUser = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        e.stopPropagation();

        const ValidatedInputData = ValidateInputData(userEmail, userPassword);

        if(!ValidatedInputData.IsValid) {
           return;
        }

        try {
            setLoading(true);

            const payload = {
                email: ValidatedInputData.email,
                password: ValidatedInputData.password,
                captchaToken:ValidatedInputData.captchaToken
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/users/login`,payload,{
                withCredentials: true,
            });

            if(response.data.success){
                ToastFunction('success',response.data.message);
                ResetInputData();
                // Navigate to home page after successful login
                router.push('/');

            }else{
                ToastFunction('error',response.data.message || 'Failed to Login');
                ResetInputData();
            }
        } catch (error) {
            ToastFunction('error',error);
            ResetInputData();
        }finally{
            setLoading(false);
        }

        
    }
  return (
    <div className='container'>
        <div className='row gx-5'>
             <div className="col d-none d-lg-flex align-items-center justify-content-center min-vh-100">
                <Image src={'/assets/AuthCompanyImage1.png'} alt="k12 advantages" width={600} height={400} priority quality={70} className="img-fluid" />
                
            </div>
            <div className='col'>
                <form onSubmit={handleLoginUser} className='d-flex align-items-center justify-content-center min-vh-100 px-lg-5 ms-lg-5 me-lg-4'>
                    <div className='row row-cols-1 gy-3'>
                        <div className='col d-flex justify-content-center align-items-center'>
                            <div className='d-flex gap-1 align-items-center'>
                                <Image src="/assets/logo.png" alt="ChitChat Logo" width={48} height={48} priority quality={1}/>
                                {/* <img src="/assets/logo.png" alt="ChitChat Logo" style={{width:'48px', height:'48px'}} className=''/> */}
                                <h1 className='fs-4 fw-semibold logo-title'>ChitChat</h1>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='form-group'>
                                <InputEmail labelText='Email' name='email' inputType='email' placeholder={`abc@example.com`} inputValue={userEmail} setInputValue={setUserEmail} error={emailError} disabled={loading}/>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='form-group'>
                                <InputPassword labelText='Password' placeholder={`#########`} value={userPassword} setValue={setUserPassword} error={passwordError} disabled={loading}/>
                            </div>
                            <p className='text-end'>
                                <Link href={'/accounts/auth/forgot-password'} style={{fontSize:'12px'}} className='custom-link'>Forgot Password?</Link>
                            </p>
                        </div>

                        <div className='col' style={{position:'relative' , zIndex:0}}>
                            <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            ref={captchaRef}
                            onChange={()=>setCaptchaVerified(true)}
                            onExpired={()=>setCaptchaVerified(false)}
                        />
                        </div>

                        <div className='col'>
                            <button type="submit" className="btn login-btn  w-100 d-flex justify-content-center align-items-center" style={{position:'relative', zIndex:1}}>
                                <Condition>
                                    <Condition.When isTrue={loading}>
                                        <div className='d-flex align-items-center'>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            <span className='fw-medium'>Login...</span>
                                        </div>
                                    </Condition.When>
                                    <Condition.Else>
                                        <span className='fw-normal'>Login</span>
                                    </Condition.Else>
                                </Condition>
                            </button>
                            
                        </div>

                        <div className='col text-center'>
                            <span style={{ fontSize: '13px' }}>
                                Don't have an account?{" "}
                                <Link
                                    href="/accounts/auth/signup" 
                                    className="custom-link fw-semibold"
                                >
                                    Signup
                                </Link>
                            </span>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login
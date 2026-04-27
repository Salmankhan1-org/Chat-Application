'use client'
import React, { useState } from 'react'
import Link from 'next/link';
import { Condition } from '../Conditions/Condition';
import '@/public/css/login.css'
import dynamic from 'next/dynamic';
import {  ValidateEmail, ValidatePassword, ValidateUserName } from '@/utils/validations';
import axios from 'axios';
import { ToastFunction } from '@/utils/toast-function';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ToggleBootstrapModal } from '@/utils/toggleBootstrapModal';
// @ts-ignore
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

// import VerifyOTPModal from '@/components/accounts/VerifyOTPModal';

const VerifyOTPModal = dynamic(()=>import('@/components/accounts/VerifyOTPModal'),{ssr:false});
const InputField = dynamic(()=>import('@/components/inputs/inputField'))
const InputPassword = dynamic(()=>import('@/components/inputs/inputPassword'));

const Signup = () => {
    const [username, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [bio,setBio] = useState('');
    const [profileImage, setProfileImage] = useState<File|null>(null);
    const [emailError, setEmailError] = useState<string|undefined>('');
    const [passwordError, setPasswordError] = useState<string|undefined>('');
    const [usernameErrors, setUsernameErrors] = useState<string|undefined>('');

    const [loading , setLoading] = useState(false);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    const ValidateSignupData = (email:string, password:string, name:string)=>{
        let IsValid = true;

        const ValidatedEmail = ValidateEmail(email);
        const ValidatedPassword = ValidatePassword(password);
        const ValidatedUsername = ValidateUserName(name);

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

        if(!ValidatedUsername.isValid){
            setUsernameErrors(ValidatedUsername.message);
            IsValid= false;
        }else{
            setUsernameErrors('');
        }

        return {isValid:IsValid, email:ValidatedEmail.value, password:ValidatedPassword.value, name:ValidatedUsername.value}
    }

    const ResetInputField = ()=>{
        setUserName('');
        // setUserEmail('');
        setBio('');
        setProfileImage(null);
        setUserPassword('');
    }
    
    const handleSignupUser = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        e.stopPropagation();

        const ValidatedSignupData = ValidateSignupData(userEmail, userPassword, username);
        

        if(!ValidatedSignupData.isValid) {
           return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('username',username);
            formData.append('email', userEmail);
            formData.append('password',userPassword);
            formData.append('bio', bio);
            if(profileImage){
                formData.append('profileImage',profileImage);
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/users/create/new`,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                withCredentials: true,
            });

            if(response.data.success){
                ToastFunction('success',response.data.message);
                // Open OTP Modal to verify the email
                ToggleBootstrapModal('verify-email-otp-modal', 'show');

                ResetInputField();
                // router.push('/');
            }else{
                ToastFunction('error',response.data.message || 'Failed to Signup');
                ResetInputField();
            }
        } catch (error) {
            ToastFunction('error', error);
            ResetInputField();
        }finally{
            setLoading(false);
        }

    }



  return (
    <div className='container '>
        <div className='row gx-5'>
           
            <div className="col d-none d-lg-flex align-items-center justify-content-center min-vh-100">
                <Image src={'/assets/AuthCompanyImage1.png'} alt="k12 advantages" width={600} height={400} priority  quality={70} className="img-fluid" />
            </div>
           
            <div className='col'>
                <form onSubmit={handleSignupUser} className='d-flex align-items-center justify-content-center min-vh-100 px-lg-5 ms-lg-5 me-lg-4'>
                    <div className='row row-cols-1 gy-2'>
                         <div className='col d-flex justify-content-center align-items-center'>
                            <div className='d-flex gap-1 align-items-center'>
                                <Image src="/assets/logo.png" alt="ChitChat Logo" width={48} height={48} priority quality={1}/>
                                {/* <img src="/assets/logo.png" alt="ChitChat Logo" style={{width:'48px', height:'48px'}} className=''/> */}
                                <h1 className='fs-4 fw-semibold logo-title'>ChitChat</h1>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='form-group'>
                                <InputField labelText='Username' name='Username' inputType='text' placeholder={`e.g, Salman khan`} inputValue={username} setInputValue={setUserName} error={emailError} disabled={loading}/>
                            </div>
                        </div>
                        <div className='col'>
                            <div className='form-group'>
                                <InputField labelText='Email' name='email' inputType='email' placeholder={`abc@example.com`} inputValue={userEmail} setInputValue={setUserEmail} error={emailError} disabled={loading}/>
                            </div>
                        </div>
                        {/* Bio (Textarea) */}
                        <div className='col'>
                            <div className='form-group'>
                                <label className='form-label mb-0 fw-medium' style={{fontSize:'13px'}}>Bio</label>
                                <textarea
                                    className='form-control'
                                    rows={3}
                                    placeholder='Tell something about yourself...'
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className='col'>
                            <div className='form-group'>
                                <InputPassword labelText='Password' placeholder={`########`} value={userPassword} setValue={setUserPassword} error={passwordError} disabled={loading}/>
                            </div>
                        </div>

                        {/* Profile Image Upload */}
                        <div className='col'>
                            <div className='form-group'>
                                <label className='form-label mb-0 fw-medium' style={{fontSize:'13px'}}>Profile Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleImageChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        
                        <div className='col mt-3'>
                            <button type="submit" className="btn login-btn  w-100" disabled={loading}>
                                <Condition>
                                    <Condition.When isTrue={loading}>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        <span className='fw-normal'>Signing Up...</span>
                                    </Condition.When>
                                    <Condition.Else>
                                        <span className='fw-normal'>Sign Up</span>
                                    </Condition.Else>
                                </Condition>
                            </button>
                            
                        </div>

                        <div className='col text-center'>
                            <span style={{ fontSize: '13px' }}>
                                Already have an account?{" "}
                                <Link
                                    href="/accounts/auth/login" 
                                    className="text-decoration-none fw-semibold"
                                >
                                    Login
                                </Link>
                            </span>
                        </div>

                    </div>
                </form>
            </div>
        </div>
        <VerifyOTPModal email={userEmail}/>
    </div>
  )
}

export default Signup
'use client'
import Image from 'next/image'
import React, { FormEvent, useState } from 'react'
import { Condition } from '../Conditions/Condition'
import Link from 'next/link'
import '@/public/css/login.css'
import dynamic from 'next/dynamic'
import { ValidateEmail, ValidatePassword } from '@/utils/validations'
import { ToastFunction } from '@/utils/toast-function'
import axios from 'axios'
import OTPInput from 'react-otp-input'
import InputPassword from '../inputs/inputPassword'


const InputEmail = dynamic(()=>import('@/components/inputs/inputField'));

const ForgotPassword = () => {
    const [status, setStatus] = useState(false);
    const [otpStatus, setOtpStatus] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState('');
    const [otpError, setOtpError] = useState<string | undefined>('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string | undefined>('');
    const [sendingCode, setSendingCode] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | undefined>('');
    const [passwordStatus, setPasswordStatus] = useState(false);

    const handleSendOTP = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        let IsValid = true;

        const ValidatedEmail = ValidateEmail(email);

         if(!ValidatedEmail.isValid){
            setEmailError(ValidatedEmail.message)
            IsValid = false;
        }else{
            setEmailError('');
        }

        if(!IsValid) return;


        try {

            setSendingCode(true);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/users/forgot-password/send-otp`,{email});
            
            if(response.data.success){
                setStatus(true);
                ToastFunction('success', response.data.message);
            }else{
                ToastFunction('error', response.data.message || 'Failed to Send OTP');
            }
        } catch (error) {
            ToastFunction('error', error);
        }finally{
            setSendingCode(false);
        }

    }


    const handleVerifyOTP = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();

        if(enteredOtp.length !== 6){
            setOtpError("OTP must be of 6 digits");
            return;
        }


        try {
            setVerifyingOtp(true);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/users/forgot-password/verify-otp`,{email, otp:enteredOtp});

            if(response.data.success){
                setOtpStatus(true);
                ToastFunction('success', response.data.message);
            }else{
                ToastFunction('error', response.data.message || 'Failed to Verify OTP');
            }
        } catch (error) {
            ToastFunction('error', error);
        }finally{
            setVerifyingOtp(false);
        }
    }


    const handleChangePassword = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        e.stopPropagation();


        if(newPassword != confirmPassword){
            setPasswordError('New Password and Confirm does not Match');
            return;
        }

        // let IsValid = true;

        // const ValidatedNewPassword = ValidatePassword(newPassword);
        // const ValidatedConfirmPassword = ValidatePassword(confirmPassword);

        // if(!ValidatedNewPassword.isValid){
        //     setPasswordError(ValidatedNewPassword.message);
        //     IsValid = false;
        // }else{
        //     setPasswordError('');
        // }

        // if(ValidatedConfirmPassword.isValid){
        //     setPasswordError(ValidatedNewPassword.message);
        //     IsValid = false;
        // }else{
        //     setPasswordError('');
        // }

        // if(!IsValid){
        //     return;
        // }

        try {
            setChangingPassword(true);

            const payload = {
                newPassword,
                confirmPassword,
                email
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/users/forgot-password/reset-password`,payload,{
                headers:{
                    'Content-Type':'application/json'
                }
            });

            if(response.data.success){
                setPasswordStatus(true);
                ToastFunction('success', response.data.message);
            }else{
                setPasswordStatus(false);
                ToastFunction('error', response.data.message || 'Failed to reset Password');
            }
        } catch (error) {
            ToastFunction('error', error);
        }finally{
            setChangingPassword(false);
        }

    }

  return (
    <div className='bg-light'>
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
            <div style={{minWidth:'25rem'}}>
                <div className='d-flex gap-1 align-items-center justify-content-center mb-4'>
                    <Image src="/assets/logo.png" alt="ChitChat Logo" width={48} height={48} priority quality={70}/>
                    {/* <img src="/assets/logo.png" alt="ChitChat Logo" style={{width:'48px', height:'48px'}} className=''/> */}
                    <h1 className='fs-4 fw-semibold logo-title'>ChitChat</h1>
                </div>
                <Condition>
                    <Condition.When isTrue={!status && !otpStatus}>
                        <form onSubmit={handleSendOTP} method='post'>
                            <div className="text-center mb-3">
                                <p className="mb-3 fw-medium" style={{fontSize:"35px"}}>Forgot Password</p>
                                <p className="mb-0 small">Enter your registered email to receive password reset code.</p>
                            </div>

                            <div className='row g-3'>
                                <div className="col-12">
                                    <div className="d-flex float-end text-align-center mb-1">
                                        <Link href="/accounts/auth/login" className="text-decoration-none text-dark ">
                                            <small className=" d-flex float-end align-items-center gap-1"><i className="bi bi-chevron-left small"></i> Back to Login</small>
                                        </Link>
                                    </div>
                                    <div className="form-group">
                                        <InputEmail labelText='Email' name='email' inputType='email' placeholder={`abc@example.com`} inputValue={email} setInputValue={setEmail} error={emailError} disabled={sendingCode}/>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <div className="d-grid">
                                            <button type="submit" className="btn login-btn btn-sm" disabled={sendingCode}>
                                                <Condition>
                                                    <Condition.When isTrue={sendingCode}>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        <span>Sending Code...</span>
                                                    </Condition.When>
                                                    <Condition.Else>
                                                        <span>Send Code</span>
                                                    </Condition.Else>
                                                </Condition>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Condition.When>
                    <Condition.When isTrue={status && !otpStatus}>
                        <form onSubmit={handleVerifyOTP} method='post'>
                            <div className="text-center mb-4">
                                <h3 className="mb-2">Verify Code</h3>
                                <p className="mb-0 small">Enter <b>OTP</b> which sent to your registered email.</p>
                            </div>
                            <div className='row g-3'>
                                <div className='col-12 '>
                                    <div className="d-flex justify-content-end mb-2">
                                        <Link href="/accounts/auth/login" className="text-decoration-none text-dark">
                                            <small className='d-flex align-items-center gap-1'><i className="bi bi-chevron-left small ms-1"></i> Back to Log in</small>
                                        </Link>
                                    </div>
                                    <div className='form-group mb-3' > 
                                        <OTPInput
                                            value={enteredOtp}
                                            onChange={(value) => {
                                                setEnteredOtp(value.replace(/\D/g, ""));
                                                setOtpError("");
                                            }}
                                            numInputs={6}
                                            shouldAutoFocus
                                            containerStyle="d-flex justify-content-center gap-2"
                                            inputStyle={{
                                                width: "45px",
                                                height: "45px",
                                                border: "1px solid #ced4da",
                                                borderRadius: "6px",
                                                textAlign: "center",
                                                fontSize: "18px",
                                                fontWeight: "500"
                                            }}
                                            renderInput={(props) => <input {...props} className="otp-input" />}
                                        />

                                        {otpError && (
                                            <small className="text-danger">{otpError}</small>
                                        )}
                                    </div>
                                    <div className='col-12'>
                                        <button type="submit" className="btn login-btn  w-100 d-flex justify-content-center align-items-center" style={{position:'relative', zIndex:1}}>
                                            <Condition>
                                                <Condition.When isTrue={verifyingOtp}>
                                                    <div className='d-flex align-items-center'>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        <span className='fw-medium'>Verifying...</span>
                                                    </div>
                                                </Condition.When>
                                                <Condition.Else>
                                                    <span className='fw-normal'>Verify</span>
                                                </Condition.Else>
                                            </Condition>
                                        </button>
                                        
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Condition.When>
                    <Condition.When isTrue={status && otpStatus && passwordStatus}>
                        <div className="text-center">
                            <h5 className="mt-3">Account password has been changed successfully!</h5>
                            <Link href="/accounts/auth/login" className="btn login-btn w-100 btn-sm mt-3">Go to Login Page</Link>
                        </div>
                    </Condition.When>
                    <Condition.When isTrue={status && otpStatus}>
                        <form onSubmit={handleChangePassword} method='post'>
                            <div className="text-center mb-3">
                                <p className="mb-3 fw-medium" style={{fontSize:"35px"}}>Reset Password</p>
                                <p className="mb-0 small">Enter new Password to Reset your password</p>
                            </div>

                            <div className='row g-3'>
                                <div className="col-12">
                                    <div className="d-flex float-end text-align-center mb-1">
                                        <Link href="/accounts/auth/login" className="text-decoration-none text-dark ">
                                            <small className=" d-flex float-end align-items-center gap-1"><i className="bi bi-chevron-left small"></i> Back to Login</small>
                                        </Link>
                                    </div>
                                    <div className='form-group'>
                                        <InputPassword labelText='New Password' placeholder={`#########`} value={newPassword} setValue={setNewPassword} error={passwordError} disabled={changingPassword}/>
                                    </div>
                                    <div className='form-group'>
                                        <InputPassword labelText='Confirm Password' placeholder={`#########`} value={confirmPassword} setValue={setConfirmPassword} error={passwordError} disabled={changingPassword}/>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <div className="d-grid">
                                            <button type="submit" className="btn login-btn btn-sm" disabled={changingPassword}>
                                                <Condition>
                                                    <Condition.When isTrue={changingPassword}>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        <span>Reseting...</span>
                                                    </Condition.When>
                                                    <Condition.Else>
                                                        <span>Reset Password</span>
                                                    </Condition.Else>
                                                </Condition>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Condition.When>
                </Condition>
            </div>
        </div>
    </div>
  )
}

export default ForgotPassword
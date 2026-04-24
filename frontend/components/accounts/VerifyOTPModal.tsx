'use client'
import React, { useEffect, useState } from 'react'
import { Condition } from '../Conditions/Condition'
import OTPInput from 'react-otp-input';
import { ToastFunction } from '@/utils/toast-function';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToggleBootstrapModal } from '@/utils/toggleBootstrapModal';

const VerifyOTPModal = ({email}:{email:string}) => {
    const [loading, setLoading] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState('');
    const [otpError, setOtpError] = useState<string|undefined>('');
    const router = useRouter();

    const ResetFieldAndModal = ()=>{
        setEnteredOtp('');
        setOtpError('');
        ToggleBootstrapModal('verify-email-otp-modal', 'hide');
    }

    const handleVerifyEmailUsingOtp = async (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        e.stopPropagation();

        if(enteredOtp.length !== 6){
            setOtpError("OTP must be of 6 digits");
            return;
        }

        if(!email){
            ToastFunction('error', 'Email is required to verify OTP');
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/users/verify/email`,{otp:enteredOtp, email},{
                headers:{
                    'Content-Type':'application/json'
                }
            });

            if(response.data.success){
                ToastFunction('success',response.data.message);
                ResetFieldAndModal();
                router.push('/');
            }else{
                ToastFunction('error',response.data.message || 'Failed to verify email');
            }
            
        } catch (error) {
            ToastFunction('error',error);

        }finally{
            setLoading(false);
        }
    }
  return (
    <div className="modal fade" id="verify-email-otp-modal" role="dialog" aria-labelledby="VerifyEmailUsingOTPModal" tabIndex={-1} aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content" style={{border:'none'}} >
      <div className="modal-header custom-modal-header">
        <h5 className="modal-title fs-6" id="VerifyEmailUsingOTPModal">Email Verification</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <p className="text-muted">
            Enter the OTP sent to your registered email.
        </p>

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
      <div className="modal-footer py-2" style={{border:'none'}}>
        <button type="button" className="btn btn-secondary btn-sm close-modal-custom-btn" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-custom btn-sm" onClick={handleVerifyEmailUsingOtp}>
            <Condition>
                <Condition.When isTrue={loading}>
                    <div className='d-flex align-items-center'>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span className='fw-medium'>Verifying...</span>
                    </div>
                </Condition.When>
                <Condition.Else>
                    <span className='fw-normal'>Verify Email</span>
                </Condition.Else>
            </Condition>
        </button>
      </div>
    </div>
  </div>
</div>
  )
}

export default VerifyOTPModal
'use client'
import { useState } from 'react';
import { Condition } from '../Conditions/Condition';

export interface InputPasswordParams{
    labelText: string,
    value: string,
    placeholder: string,
    setValue: (password: string)=>void,
    error:string | undefined,
    disabled: boolean
}

const InputPassword = ({ labelText="", value, placeholder, setValue,error,disabled}:InputPasswordParams) => {
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState('eye-slash');
    function HandleTogglePassword() {
        if (type == 'password') {
            setType('text');
            setIcon('eye');
        }
        else {
            setType('password');
            setIcon('eye-slash');
        }
    }
    return (
        <div className='form-group'>
            {
            labelText!="" &&<label className="mb-0 fw-medium form-label" style={{ fontSize: "13px" }}>{labelText}</label>
                
            }
            <div className='input-group'>
                <input type={type} className="form-control " placeholder={placeholder} value={value} name='password' style={{borderRight:"none",width:"40%"}} onChange={(e)=>setValue(e.target.value)}  disabled={disabled}/>
                <span className="input-group-text input-group-sm" onClick={HandleTogglePassword} >
                    <i className={`bi bi-${icon}`}></i>
                </span>
            </div>
            <Condition>
                <Condition.When isTrue={error ? true : false}>
                    <span className=' small text-danger' >
                        {error}
                    </span>
                </Condition.When>
             </Condition>
        </div>
    )
}
export default InputPassword
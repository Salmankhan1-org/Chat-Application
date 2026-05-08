import { Condition } from "../Conditions/Condition"

export interface InputEmailsParams{
    labelText: string,
    inputType:string,
    name: string,
    inputValue: string,
    placeholder: string,
    setInputValue: (email:string)=>void,
    error:string | undefined,
    disabled: boolean
}
const InputField = ({ labelText, inputType, inputValue, placeholder, setInputValue, error, disabled }:InputEmailsParams) => {
    return (
        <div className='form-group'>
            <label className="mb-0 fw-medium form-label" style={{ fontSize: "13px" }}>{labelText}</label>
            <input type={inputType} style={{fontSize:'12px'}} className="form-control" name="email" value={inputValue} placeholder={placeholder} disabled={disabled}
                onChange={(e) => setInputValue(e.target.value)} />
            <Condition>
                <Condition.When isTrue={error ? true : false}>
                    <span className=' small text-danger ' >
                        {error}
                    </span>
                </Condition.When>
            </Condition>
        </div>
    )
}
export default InputField
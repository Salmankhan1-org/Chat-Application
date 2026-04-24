// @ts-ignore
import sanitizeHtml from 'sanitize-html';

export const ValidateEmail = (email:string) => {
    if (!email) return { isValid: false, message: "Email is required" };

    const trimmed = email.trim().toLowerCase();

    const sanitizedEmail = sanitizeHtml(trimmed);

    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!regex.test(sanitizedEmail)) {
        return { isValid: false, message: "Enter a valid email address" };
    }

    return { isValid: true, value: sanitizedEmail };
};


export const ValidatePassword = (password:string) => {
    if (!password) return { isValid: false, message: "Password is required" };

    const trimmed = password.trim();

    const sanitizedPassword = sanitizeHtml(trimmed);


    // At least 8 chars, 1 letter, 1 number
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!regex.test(sanitizedPassword)) {
        return {
            isValid: false,
            message: "Password must have min 8 characters , one uppercase , one lowercase , one number and one special char"
        };
    }

    return { isValid: true, value: sanitizedPassword };
};

export const ValidateUserName = (name:string)=>{
    if (!name) return { isValid: false, message: "Username is required" };

    const trimmed = name.trim();

    const sanitizedUserName = sanitizeHtml(trimmed);

    if (!sanitizedUserName) return { isValid: false, message: "Username is required" };



    return {isValid:true, value:sanitizedUserName}
}

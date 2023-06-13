import React, {useState} from "react";
import axios from "axios";
import { useRouter } from 'next/router'

function SignUp(){

    const navigate = useRouter();
    const [userInfo, setUserInfo] = useState({"email": "", "password": "", "confirmPassword": ""});
    const [formError, setFormError] = useState("");
    const [spinner, setSpinner] = useState(false);

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
    };

    const createAccount = async() => {
        let form_error = false;
        console.log(userInfo);
        for(const [key, value] of Object.entries(userInfo)){
            if(value.trim() === ""){
                setFormError("Error: All inputs must be filled");
                form_error = true;
            }
            if(userInfo['password'] !== userInfo['confirmPassword']){
                form_error = true;
                setFormError("Error: Passwords are not matching")
            }
        }

        if(!validateEmail(userInfo['email'])){
            form_error = true;
            setFormError("Error: Not a valid email");
        }

        if(form_error === false){
            setSpinner(true);
            const payload = {"email": userInfo.email, "password": userInfo.password};
            const res = await axios.post("http://0.0.0.0:8000/signup", payload);
            console.log(res.data);
            if(res.data.status === 200){
                const token = res.data.token;
                localStorage.setItem('authToken', token);
                navigate.push('/home');
            }else if(res.data.status === 400 || res.data.status === 500){
                setFormError(res.data.msg);
                setSpinner(false);
            }
        }
        
    }

    return(
        <div className="flex w-full h-screen flex-col sm:flex-row 2xl:h-screen">
            <div className="bg-emerald-600 w-full sm:w-1/3 flex items-center justify-center p-5 sm:p-10 md:p-15">
                <div className="bg-white flex justify-center items-center rounded-full p-5 md:p-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-16 h-16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                </div>
            </div>
            <div className="bg-gray-200 w-full sm:w-2/3 flex justify-center items-center">
                <div className="bg-slate-400 w-3/4 xl:w-2/4 px-5 py-10 mt-10 mb-10 md:mt-16 md:mb-16 rounded-md">
                    <div className="flex justify-center">
                        <h1 className="text-white text-2xl font-bold">Sign Up</h1>
                    </div>
                    
                    <div className="w-full mt-5">
                        <label className="block uppercase tracking-wide text-gray-100 text-md font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-600" id="email" type="text" placeholder="Email" value={userInfo['email']} onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}/>
                    </div>
                    <div className="w-full mt-5">
                        <label className="block uppercase tracking-wide text-gray-100 text-md font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-600" id="password" type="password" placeholder="Password" value={userInfo['password']} onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}/>
                    </div>
                    <div className="w-full mt-5">
                        <label className="block uppercase tracking-wide text-gray-100 text-md font-semibold mb-2" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input className="appearance-none block w-full bg-slate-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-600" id="confirm-password" type="password" placeholder="Confirm Password" value={userInfo['confirmPassword']} onChange={(e) => setUserInfo({...userInfo, confirmPassword: e.target.value})}/>
                    </div>

                    <div>
                        {
                            formError ? 
                            <div className="w-full bg-red-400 flex justify-center items-center rounded mt-5 py-2">
                                <h1 className="text-lg text-white font-md">{formError}</h1>
                            </div>
                            : null
                        }
                    </div>

                    <div className="flex justify-center items-center w-full p-2.5 mt-10 rounded-md px-4 duration-300 cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white"
                        onClick={() => createAccount()}>
                        <h1 className="text-white text-xl font-semibold">Create Account</h1>
                    </div>

                    <div className="flex items-center justify-center mt-7">
                        {
                            spinner ?
                                <div className="mr-5 inline-block w-10 h-10 border-4 border-emerald-600 border-t-slate-400 rounded-full animate-spin"></div>
                            : null
                        }
                    </div>

                    <div className="text-white text-sm md:text-base mt-10 flex justify-center items-center">
                        Already have an account?
                        <a className="no-underline text-blue-600 ml-1" href="/login">
                            Log In
                        </a>
                </div>
                    
                </div>
                
            </div>
        </div>
    );
};

export default SignUp;

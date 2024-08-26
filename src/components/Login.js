import React,{useState}from 'react'
import {useNavigate} from 'react-router-dom';

const Login = (props) => {
    const [credentials, setCredentials] = useState({email:"",password:""})
    let navigate=useNavigate();

    const handleSubmit=async (e)=>{
        e.preventDefault();
        const response= await fetch("http://localhost:5000/api/auth/login" ,{
            method:'POST',
            headers:{
            'Content-Type':"application/json",
            },
            body:JSON.stringify({email:credentials.email,password:credentials.password})
             });

          const json=await response.json();
        console.log(json);
        if(json.success){
            localStorage.setItem('token',json.authtoken);
            navigate('/');
            props.showAlert("logged in  successfully","success");

        }else{
            props.showAlert("invalid Credentials","danger");

        }
    }
    const onChange=(e)=>{
      
        setCredentials({...credentials,[e.target.name]:e.target.value})
      } 
  return (
    <div>
        <form onSubmit={handleSubmit}>
        <div className="mb-3" style={{ width: '600px', margin: '0 auto' }}>
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control"  value={credentials.email} onChange={onChange} id="email" name='email'  aria-describedby="emailHelp"/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3"  style={{ width: '600px', margin: '0 auto' }}>
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" autoComplete='username' className="form-control"   name='password' id="password" value={credentials.password} onChange={onChange}/>
        </div>
        <div  style={{ display: 'flex-3', justifyContent: 'center' }}>
        <button type="submit" className="btn btn-primary" >Submit</button>

        </div>
        </form>
    </div>
  )
}

export default Login

import { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
export default function Login(){ const [email,setEmail]=useState(''); const [pw,setPw]=useState(''); const [err,setErr]=useState('');
async function submit(e){ e.preventDefault(); try{ const r=await axios.post('/api/auth/login',{ email, password:pw }); localStorage.setItem('token', r.data.token); Router.push('/admin'); }catch(err){ setErr(err.response?.data?.error||err.message); } }
return (<div style={{padding:20}}><h1>Admin Login</h1><form onSubmit={submit}><input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} style={{display:'block',marginBottom:8}}/><input placeholder='password' type='password' value={pw} onChange={e=>setPw(e.target.value)} style={{display:'block',marginBottom:8}}/><button type='submit'>Login</button>{err && <p style={{color:'red'}}>{err}</p>}</form></div>) }

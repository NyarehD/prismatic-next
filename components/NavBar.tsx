import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import ProfileImage from "../public/default.jpg";

function ProfileIcon() {
  return (
    <div className="flex items-stretch">
      <div className="dropdown dropdown-end">
        <div className="avatar btn btn-circle btn-ghost" tabIndex={0}>
          <div className="w-10 h-10 rounded-full">
            <Image src={ProfileImage} alt="" />
          </div>
        </div>
        <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box w-52 p-2 mt-4 shadow">
          <li><button type="button" className="hover:bg-warning hover:text-black" onClick={() => signOut()}>Log Out</button></li>
        </ul>
      </div>
    </div>
  )
}
export default function NavBar() {
  const { data } = useSession();
  return (
    <div className="navbar md:px-10 lg:px-14 px-4 bg-gray-700">
      <div className="navbar-start">
        <Link href="/" className="hover:text-white hover:cursor-pointer text-xl font-bold normal-case transition-colors duration-300">CMS System</Link>
      </div>
      <div className="navbar-end md:flex hidden">
        <ul className="inline-flex">
          <li><Link href="/" className='btn btn-ghost hover:text-white'>Home</Link></li>
          <li><Link href="/user/users" className='btn btn-ghost hover:text-white'>Users</Link></li>
          {
            (data) ?
              <li><ProfileIcon /></li>
              :
              <>
                <li><Link href="/auth/register" className="btn btn-ghost">Register</Link></li>
                <li><Link href="/auth/login" className="btn btn-ghost">Login</Link></li>
              </>
          }
          <li>
            <button className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </li>
          <li>
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </li>
        </ul>
      </div>
      <div className="navbar-end md:hidden flex">
        <button className="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
        {data && <ProfileIcon />}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content rounded-box w-52 p-2 mt-3 bg-gray-700 shadow">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/user/users">Users</Link></li>
            {!data && (
              <>
                <li><Link href="/auth/login">Log In</Link></li>
                <li><Link href="/auth/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
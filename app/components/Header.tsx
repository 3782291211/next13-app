"use client";
import Link from "next/link";
import { useState, useContext } from "react";
import { LoggedInUserContext } from "../context/store";
import { logout } from '../api/apiRequests';
import userIsAdmin from '../helpers/userIsAdmin';
import { LoggedInUserIcon } from "./Icons";
import errorHandler from "../helpers/errorHandler";
import { useRouter } from "next/navigation";
import { clearLocalStorage } from "../helpers/updateLocalStorage";

const Header = () => {
const [showMenu, setShowMenu] = useState(false);
const [logoutNotification, showLogoutNotification] = useState('');
const [errorMsg, setErrorMsg] = useState('');
const { loggedInUser, setLoggedInUser } = useContext(LoggedInUserContext);

const router = useRouter();

const handleLogout = () => {
  logout(window.localStorage.getItem('AUTH_TOKEN') || '', window.localStorage.getItem('USER_ID') || '')
  .then(res => {
    showLogoutNotification(res.msg);
    setTimeout(() => showLogoutNotification(''), 6000);
  })
  .catch(err => {
    setErrorMsg(errorHandler(err));
    setTimeout(() => setErrorMsg(''), 6000);
  })
  .finally(() => {
    setLoggedInUser({ user: { name: '', id: '', email: '' }, token: '' });
    clearLocalStorage();
    router.push('/');
    setShowMenu(false);
  });
}

return(
    <header>
    {/* Navbar */}
      <div className="w-full bg-stone-300 bg-anim shadow-bottom">
      <nav className="relative container mx-auto p-6 pb-3">
        {/* Flex container */}
        <div className="flex items-center justify-between">
            {/* logo */}
            <div className="flex items-center py-2 space-x-2">
                <img className="w-10 h-10" src="/images/dice-5-fill.svg"/>
                <p className="text-xl">NXExams</p>
            </div>
            
            {/* menu items */}
            <div className="hidden md:flex">
              <Link className="font-semibold px-3 pb-2 border-b border-stone-400" href='/'>Home</Link>
              {userIsAdmin(loggedInUser) ? 
              <>
              <Link className="font-semibold px-3 pb-2 border-b border-stone-400" href='/exams'>Exams</Link>
              <Link className="font-semibold px-3 pb-2 border-b border-stone-400" href='/candidates'>Candidates</Link>
              </>
              : loggedInUser?.user?.id ? <Link className="font-semibold px-3 pb-2 border-b border-stone-400" href={`/candidates/${loggedInUser.user.id}`}>My Exams</Link> : null}
            </div>

            {/* login/signup */}
            {!loggedInUser?.user?.name && <div className="flex flex-start">
            <Link href='/login' className="hidden md:block p-2 px-3 rounded-lg hover:bg-gray-200">Log in</Link>
            <Link href='/signup' className="hidden md:block p-2 rounded-lg hover:bg-gray-200">Signup</Link>
            </div>}
            
            {/*Logged in user*/}
            {loggedInUser?.user?.name && <div className="flex flex-start">
            <Link href='#' className="hidden md:block p-2 mr-4 rounded-full">Hi, {loggedInUser.user.name}.</Link>
            <button onClick={handleLogout} className="hidden md:block p-2 px-3 rounded-lg text-stone-200 bg-gray-800">Logout</button>
            </div>}

             {/* === menu icon */}
             <button onClick={() => setShowMenu(!showMenu)} className={`${showMenu && 'open'} absolute mr-2 mt-2 top-1 z-10 block tripline md:hidden focus:outline-none`}>
              <span className="tripline-top"></span>
              <span className="tripline-middle"></span>
              <span className="tripline-bottom"></span>
             </button>
        </div>

        {/* mobile menu */}
        <div className={`${!showMenu && 'hidden'} md:hidden`}>
          <div className={`${loggedInUser?.user?.id ? 'pt-8' : 'p-8'} absolute flex flex-col -top-2 items-center self-end mt-10 space-y-6 bg-white sm:w-auto sm:self-center left-6 right-6 shadow-lg shadow-pink-500/40 border border-slate-300 rounded-lg`}>
            
            {!loggedInUser?.user?.id && <><Link className="hover:text-orange-500" onClick={() => setShowMenu(false)} href='/login'>Login</Link>
            <Link className="hover:text-orange-500" onClick={() => setShowMenu(false)} href='/signup'>Signup</Link></>}
            <Link className="hover:text-orange-500" onClick={() => setShowMenu(false)} href='/'>Home</Link>
            
            {userIsAdmin(loggedInUser) ? 
            <><Link className="hover:text-orange-500" onClick={() => setShowMenu(false)} href='/exams'>Exams</Link>
            <Link className="hover:text-orange-500" onClick={() => setShowMenu(false)} href='/candidates'>Candidates</Link>
            </> 
            : loggedInUser?.user?.id ? <Link className="hover:text-orange-500" href={`/candidates/${loggedInUser.user?.id}`}>My Exams</Link> : null}

            {loggedInUser?.user?.name && 
            <div className="w-full py-4 bg-brightPink text-slate-100 text-center mb-2 rounded-b-lg">
              <div className="flex justify-center">
              <LoggedInUserIcon/>
              <p>Logged in as {loggedInUser.user?.name}</p>
              </div>
              <button onClick={handleLogout} className="md:block py-2 px-3 mt-2.5 rounded-lg text-stone-200 bg-gray-800">Logout</button>
            </div>}
        </div>
        </div>
    </nav>

    {logoutNotification ? <div className="w-full bg-green-200 text-center">{logoutNotification}</div> 
    : errorMsg ?  <div className="w-full bg-red-200 text-center">{errorMsg}</div> : null}
    </div>
    {userIsAdmin(loggedInUser) && <div className="flex w-fit ml-6 mt-4 bg-slate-200 p-3 rounded">
      <p className="text-sm mr-1">Logged in as <span className="font-bold">admin</span></p>
      <img src='/images/gear.svg'/>
    </div>}
    </header>);
};

export default Header;
import Modal from '../Misc/Modal';
import { useAuth } from "../Auth/Auth.hook";
import { useState } from 'react';

export const NavbarView = () => {
    const { logout, user } = useAuth();
    const [showUpload, setShowUpload] = useState(false);

    return <div className='p-2 bg-slate-700 rounded-2xl w-100 flex m-2'>
        <h1 className="text-white text-2xl text-center font-bold py-1 px-2">
            MPI-Bench
        </h1>
        <Modal btnTitle={"Upload"} modalTitle="Upload binary" setShowModal={setShowUpload} showModal={showUpload} />

        <div className='ml-auto flex  text-xl py-1 me-3'>
            <h3>
                {user.username}
            </h3>
            <h3 className='mx-2'>
                |
            </h3>
            <h3 onClick={logout}>
                Logout
            </h3>
        </div>
    </div>

}
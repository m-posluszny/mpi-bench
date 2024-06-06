import { useAuth } from "../Auth/Auth.hook";
import { JobSelectViewer } from "../Job/jobSelect.component";
import { useSelected } from "../Job/jobSelect.hook";

export const NavbarView = () => {
    const { logout, user } = useAuth();

    return <div className='p-2 bg-slate-700 rounded-2xl w-full flex m-2'>
        <h1 className="text-white text-2xl text-center font-bold py-1 px-2">
            MPI-Bench
        </h1>

        <div className='ml-auto flex  text-xl py-1 me-3'>
            <JobSelectViewer className='mr-5' />
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
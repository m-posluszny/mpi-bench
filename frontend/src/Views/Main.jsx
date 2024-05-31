import { Footer } from '../Static/Footer.component';
import { BinariesView } from '../ Bin/bin.component';
import { PresetsView } from '../Presets/preset.component';
import { JobsView } from '../Job/job.component';
import { RunsView } from '../Run/run.component';
import { NavbarView } from './Navbar';
import { MultiPanel } from './MultiPanel';

export const MainView = () => {

  return (
    <div className=''>
      <NavbarView />
      <main className="mx-1 flex my-auto flex-row  overflow-y-visible overflow-x-hidden">
        <div className="mx-1 flex my-auto flex-row  overflow-y-visible overflow-x-hidden h-[100vh]">
          <BinariesView />
          <PresetsView />
          <JobsView />
          <RunsView />
        </div>
        <div className='w-50 flex ml-5'>
          <MultiPanel />
        </div>
      </main>
      <Footer />
    </div>
  )
}
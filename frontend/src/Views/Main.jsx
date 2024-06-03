import { Footer } from '../Static/Footer.component';
import { BinariesView } from '../ Bin/bin.component';
import { PresetsView } from '../Presets/preset.component';
import { JobsView } from '../Job/job.component';
import { RunsView } from '../Run/run.component';
import { NavbarView } from './Navbar';
import { MultiPanel } from './MultiPanel';
import { MultiViewEnum } from '../Misc/consts';
import { useState } from 'react';

export const MainView = () => {
  const [view, setView] = useState(MultiViewEnum.NONE);
  const [viewParams, setViewParams] = useState(null);

  const [selectedBinary, setSelectedBinary] = useState(null);

  const selectBin = (uid) => {
    if (selectedBinary === uid) {
      setSelectedBinary(null);
    } else {
      setSelectedBinary(uid);
    }
  }


  return (
    <div className=''>
      <NavbarView />
      <main className="mx-1 flex my-auto flex-row  overflow-y-visible overflow-x-hidden">
        <div className="mx-1 flex my-auto flex-row  overflow-y-visible overflow-x-hidden h-[100vh]">
          <BinariesView onCreate={() => { setView(MultiViewEnum.BINARY_CREATE); console.log("v") }}
            onSelect={selectBin}
            activeUid={selectedBinary}
          />
          <PresetsView onCreate={() => setView(MultiViewEnum.PRESET_CREATE)} />
          <JobsView onCompare={() => setView(MultiViewEnum.JOB_COMPARE)} />
          <RunsView />
        </div>
        <div className='w-50 flex ml-5'>
          <MultiPanel view={view} data={viewParams} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
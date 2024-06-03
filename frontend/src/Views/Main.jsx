import { Footer } from '../Static/Footer.component';
import { BinariesView } from '../ Bin/bin.component';
import { PresetsView } from '../Presets/preset.component';
import { JobsView } from '../Job/job.component';
import { RunsView } from '../Run/run.component';
import { NavbarView } from './Navbar';
import { MultiPanel } from './MultiPanel';
import { MultiViewEnum } from '../Misc/consts';
import { useState } from 'react';

export const useSelector = () => {
  const [s, setS] = useState(
    null
  )
  const selectS = (ns) => {
    if (s === ns) {
      setS(null);
    } else {
      setS(ns);
    }
  }
  return [s, selectS]
}

export const MainView = () => {
  const [view, setView] = useState(MultiViewEnum.NONE);
  const [viewParams, setViewParams] = useState(null);
  const [selectedBinary, selectBin] = useSelector();
  const [selectedPreset, selectPreset] = useSelector(null);
  const [selectedJob, selectJob] = useSelector(null);

  const onPresetSelect = (data) => {
    if (data === null || data.uid === selectedPreset) {
      setViewParams(null);
      selectPreset(null);
      setView(MultiViewEnum.NONE);
      return;
    }
    setView(MultiViewEnum.PRESET_VIEW);
    setViewParams(data);
    selectPreset(data.uid);
  }

  return (
    <div className=''>
      <NavbarView />
      <main className="mx-1 flex flex-row  overflow-y-visible overflow-x-hidden">
        <div className="mx-1 flex flex-row  overflow-y-visible overflow-x-hidden">
          <BinariesView onCreate={() => { setView(MultiViewEnum.BINARY_CREATE); console.log("v") }}
            onSelect={selectBin}
            activeUid={selectedBinary}
          />
          <PresetsView
            onCreate={() => setView(MultiViewEnum.PRESET_CREATE)}
            onSelect={onPresetSelect}
            activeUid={selectedPreset}
          />
          {
            selectedPreset &&
            <JobsView onCompare={() => setView(MultiViewEnum.JOB_COMPARE)} puid={selectedPreset} />
          }
          {
            selectedJob &&
            <RunsView />
          }
        </div>
        <div className='w-50 flex ml-5'>
          <MultiPanel view={view} data={viewParams} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
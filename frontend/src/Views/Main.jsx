import { Footer } from '../Static/Footer.component';
import { BinariesView } from '../ Bin/bin.component';
import { PresetsView } from '../Presets/preset.component';
import { JobsView } from '../Job/job.component';
import { RunsView } from '../Run/run.component';
import { NavbarView } from './Navbar';
import { MultiPanel } from './MultiPanel';
import { MultiViewEnum } from '../Misc/consts';
import { useState } from 'react';
import { useSelected } from '../Job/jobSelect.hook';

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
  const { selectedList } = useSelected();
  const [viewParams, setViewParams] = useState(null);
  const [selectedBinary, selectBin] = useSelector();
  const [selectedPreset, selectPreset] = useSelector(null);
  const [selectedJob, selectJob] = useSelector(null);
  const [selectedRun, selectRun] = useSelector(null);

  const onPresetSelect = (data) => {
    selectJob(null);
    selectRun(null)
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

  const onRunSelect = (data) => {
    if (data === null || data.uid === selectedRun) {
      setViewParams(null);
      selectRun(null);
      setView(MultiViewEnum.NONE);
      return;
    }
    setView(MultiViewEnum.RUN_VIEW);
    setViewParams(data);
    selectRun(data);
  }

  const onPlot = () => {
    if (selectedList?.length === 0) {
      alert("Please select at least one job")
      return
    }
    setView(MultiViewEnum.JOB_PLOT);
  }

  return (
    <div className=''>
      <NavbarView />
      <main className="mx-1 flex overflow-auto">
        <div className="mx-1 flex ">
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
            <JobsView puid={selectedPreset} onSelect={selectJob} activeUid={selectedJob?.uid} onPlot={onPlot} activeBinaryUid={selectedBinary} />
          }
          {
            selectedPreset && selectedJob &&
            <RunsView juid={selectedJob.uid} activeUid={selectedRun?.uid} onSelect={onRunSelect} />
          }
        </div>
        <div className='w-50 flex ml-5'>
          <MultiPanel view={view} data={viewParams} />
        </div>
        <div hidden className='bg-blue-400 bg-indigo-500 bg-purple-700'>

        </div>
      </main>
      <Footer />
    </div>
  )
}
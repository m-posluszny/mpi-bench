import { useSelected } from './jobSelect.hook.js';

export const JobSelectViewer = ({ className }) => {
    const { selectedList, resetList } = useSelected();

    return <div className={` rounded bg-slate-500 py-1 font-bold px-2 text-sm ${className}`}>
        Selected: {selectedList.length} | <button className="bg-red-500 px-2 rounded" onClick={resetList}>Clear</button>

    </div>
}
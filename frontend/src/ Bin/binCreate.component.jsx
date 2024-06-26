import { FormRow, PanelClass } from "../Misc/UI.component";
import { useBinaries } from "./bin.hook";

export const BinaryCreateView = () => {

    const { createBin, refresh } = useBinaries();


    const handleFormSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const file = form.elements.file.files[0];
        const name = form.elements.name.value;
        const tag = form.elements.tag.value;
        const branch = form.elements.branch.value;
        let commit_uid = form.elements.commit.value;
        commit_uid = commit_uid ? commit_uid : ""

        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        return createBin(formData, { name, tag, branch, commit_uid })
            .then(data => {
                alert('File and metadata uploaded successfully');
                refresh()
                form.reset()
            })
            .catch(error => {
                console.log(error)
                alert(`File and metadata uploda error: ${error.detail}`);
            });
    };

    const inputClass = "ml-auto rounded text-black";
    const labelClass = "text-white mr-4";

    return (
        <form className={PanelClass}
            onSubmit={handleFormSubmit}>
            <div className="text-white font-bold my-3">
                Upload binary
            </div>
            <div class="border border-dashed rounded-xl bg-slate-500 relative">
                <input type="file" name="file" id="file" required className="cursor-pointer file:hidden relative block  w-full h-full text-center py-4 z-50"></input>
            </div>
            <FormRow>
                <label className={labelClass}>
                    Name:
                </label>
                <input className={inputClass} type="text" name="name" required />
            </FormRow>
            <FormRow>
                <label className={labelClass}>
                    Tag:
                </label>
                <input className={inputClass} type="text" name="tag" required />
            </FormRow>
            <FormRow>
                <label className={labelClass}>
                    Branch:
                </label>
                <input className={inputClass} type="text" name="branch" required />
            </FormRow>
            <FormRow>
                <label className={labelClass}>
                    Commit UID
                </label>
                <input className={inputClass} type="text" name="commit" />
            </FormRow>
            <FormRow>
                <button className="bg-orange-600 rounded-2xl p-3 mx-auto" type="submit">Upload</button>
            </FormRow>
        </form>
    );
};


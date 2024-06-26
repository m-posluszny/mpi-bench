import { defaultActiveColor } from "./consts"

export const PanelClass = "bg-slate-600 rounded-xl p-3 w-full"

export const ParseDate = (date) => new Date(date).toLocaleString("en-UK")

export const Tile = ({ className, children, isActive = false, activeColor = defaultActiveColor, onClick }) => {

    const activeStyle = isActive ? `border ${activeColor}` : ""
    const hoverStyle = onClick ? "hover:bg-slate-400" : ""
    return <div
        onClick={onClick ? onClick : () => { }}
        className={`bg-slate-500 rounded-xl p-3 my-1 ${className} ${activeStyle} ${hoverStyle} `}>
        {children}
    </div>
}

export const Tiles = ({ children }) => (
    <div
        className='ml-3 bg-slate-600 h-min p-3 rounded-xl flex-col overflow-y-auto max-h-[calc(100vh-100px)] w-fit'>
        {children}
    </div>
)

export const Header = ({ title, btnTitle, btnClass, className = "", onClick = () => { } }) => {
    return <div className={`flex mb-3 ${className}`}>
        <h2 className="font-bold me-5">
            {title}
        </h2>
        {
            btnTitle &&
            <button className={`ml-auto 
          p-1 rounded-xl bg-gray-500 text-xs font-bold px-2 ${btnClass} hover:bg-slate-300`} onClick={() => onClick()}>{btnTitle}</button>
        }
    </div >

}

export const FormRow = ({ children }) => (
    <div className="my-3 p-auto flex">
        {children}
    </div>
)

export const FormGroup = ({ children, bgColor = "bg-slate-500" }) => (
    <div className={`my-1 p-auto ms-3 ${bgColor} rounded px-2 p-1`}>
        {children}
    </div>
)


export const Select = ({ items, item, setItem, all = false, className = "" }) => (
    <select className={`text-white rounded p-2 bg-slate-400 ${className}`} onChange={(e) => setItem(e.target.value)} value={item}>
        {all && <option value="">all</option>}
        {
            items.map((branch) => <option key={branch} value={branch}>{branch}</option>)
        }
    </select>
)

export const Input = ({ value, setValue, className = "", type = "text" }) => (
    <input
        className={`text-white text-sm rounded p-1 bg-slate-400 ${className} box-border w-full`}
        value={value}
        type={type}
        onChange={(e) => setValue(e.target.value)}
    />
)
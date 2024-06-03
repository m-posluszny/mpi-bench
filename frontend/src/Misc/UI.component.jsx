import { defaultActiveColor } from "./consts"

export const PanelClass = "bg-slate-600 rounded-xl p-3"

export const Tile = ({ children, isActive = false, activeColor = defaultActiveColor, onClick }) => {

    const activeStyle = isActive ? `border ${activeColor}` : ""
    const hoverStyle = onClick ? "hover:bg-slate-400" : ""
    return <div
        onClick={onClick ? onClick : () => { }}
        className={`bg-slate-500 rounded-xl p-3 my-1 ${activeStyle} ${hoverStyle} `}>
        {children}
    </div>
}

export const Tiles = ({ children }) => (
    <div
        className='ml-3 bg-slate-600 h-min p-3 rounded-xl flex-co'>
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

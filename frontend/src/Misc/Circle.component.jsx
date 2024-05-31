export const Circle = ({ children, className }) => (
    <div className={` w-min h-min px-4 py-1 font-bold text-gray-700 rounded-full  flex items-center justify-center font-mono ${className ? className : "bg-white"}`} >
        {children}
    </div>
)



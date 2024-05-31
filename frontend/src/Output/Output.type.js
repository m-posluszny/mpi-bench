import { FaExclamationCircle, FaQuestionCircle, FaCheckCircle } from "react-icons/fa";
export const OutputSuccess = "success"
export const OutputLoading = "loading"
export const OutputError = "error"


export const OutputColor = (type) => {
    switch(type) {
        case OutputSuccess:
            return "bg-green-400"
        case OutputLoading:
            return "bg-yellow-400"
        case OutputError:
            return "bg-red-400"
        default:
            return "bg-gray-400"
    }
}

export const OutputIcon = ({ type, className }) => {
    if (!className) className = "inline-block text-gray-600 text-5xl"
    switch(type) {
        case OutputSuccess:
            return <FaCheckCircle className={className} />
        case OutputLoading:
            return <FaQuestionCircle className={className} />
        case OutputError:
            return <FaExclamationCircle className={className} />
        default:
            return <FaQuestionCircle className={className}/>
    }
}
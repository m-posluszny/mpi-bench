export const ErrorComponent = ({ error }) => {
    console.log(error)
    return <div className="rounded-lg bg-red-500 bg-opacity-50 text-lg text-center p-5 text-white w-fit mx-auto my-10">
        <h1 className="text-2xl">
            Error
        </h1>
        <p>
            {error ? error.detail : "Something went wrong"}

        </p>
    </div>

}
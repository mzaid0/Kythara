import React from 'react'

const Loader = () => {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="flex flex-col gap-4 items-center justify-center">
                <div
                    className="w-20 h-20 border-4 border-transparent text-primary text-4xl animate-spin flex items-center justify-center border-t-primary rounded-full"
                >
                    <div
                        className="w-16 h-16 border-4 border-transparent text-secondary text-2xl animate-spin flex items-center justify-center border-t-secondary rounded-full"
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default Loader
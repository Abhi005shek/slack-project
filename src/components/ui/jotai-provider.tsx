"use client"

import { Provider } from "jotai"

interface JotaiProps {
    children: React.ReactNode
}

export const JotaiProvider = ({children}: JotaiProps) => {
    return <Provider>
        {children}
    </Provider>
}
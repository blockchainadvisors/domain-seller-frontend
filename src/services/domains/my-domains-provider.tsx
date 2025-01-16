"use client"

import { createContext, Dispatch, useContext, useState } from "react";

interface IMyDomainsContext {
    domain: any;
    setDomain: Dispatch<any>
}

const MyDomainsContext = createContext<IMyDomainsContext>({} as IMyDomainsContext);

export const MyDomainsProvider = ({ children }: any) => {
    const [domain, setDomain] = useState<any>(null);

    return (
        <MyDomainsContext.Provider
            value={{
                domain,
                setDomain
            }}
        >
            {children}
        </MyDomainsContext.Provider>
    )
}

export const useMyDomain = () => {
    return useContext(MyDomainsContext);
}
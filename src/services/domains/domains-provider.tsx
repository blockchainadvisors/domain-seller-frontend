"use client";

import React, {
  useState,
  useMemo,
  PropsWithChildren,
} from "react";
import {
  Domain,
  DomainContext,
  DomainContextType,
  DomainActionsContext,
  DomainActionsContextType,
} from "./domains-context";

function DomainProvider( children : PropsWithChildren<{}>) {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const contextValue = useMemo<DomainContextType>(
    () => ({
      selectedDomain,
      setSelectedDomain,
    }),
    [selectedDomain]
  );

  const actionsValue = useMemo<DomainActionsContextType>(
    () => ({
      selectDomain: (domain: Domain) => setSelectedDomain(domain),
      clearSelectedDomain: () => setSelectedDomain(null),
    }),
    []
  );

  return (
    <DomainContext.Provider value={contextValue}>
      <DomainActionsContext.Provider value={actionsValue}>
        {children.children}
      </DomainActionsContext.Provider>
    </DomainContext.Provider>
  );
}


export default DomainProvider ;

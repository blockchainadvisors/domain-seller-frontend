import { useContext } from "react";
import { DomainActionsContext, DomainContext } from "./domains-context";



function useDomain() {
    const context = useContext(DomainContext);
    if (!context) {
      throw new Error("useDomain must be used within a DomainProvider");
    }
    return context;
  }

  
export  default useDomain;
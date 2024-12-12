import { useContext } from "react";
import { DomainActionsContext, DomainContext } from "./domains-context";


  
  function useDomainActions() {
    const context = useContext(DomainActionsContext);
    if (!context) {
      throw new Error("useDomainActions must be used within a DomainProvider");
    }
    return context;
  }

export default useDomainActions;

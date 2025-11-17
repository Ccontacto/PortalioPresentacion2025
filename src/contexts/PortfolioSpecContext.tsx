import { createContext, useContext } from 'react';

import { portfolioSpec } from '../content/portfolioSpec';

const PortfolioSpecContext = createContext(portfolioSpec);

export function PortfolioSpecProvider({ children }: { children: React.ReactNode }) {
  return <PortfolioSpecContext.Provider value={portfolioSpec}>{children}</PortfolioSpecContext.Provider>;
}

export const usePortfolioSpec = () => {
  const spec = useContext(PortfolioSpecContext);
  if (!spec) {
    throw new Error('usePortfolioSpec must be used within PortfolioSpecProvider');
  }
  return spec;
};

export const usePortfolioTokens = () => usePortfolioSpec().tokens;
export const usePortfolioContent = <T extends keyof typeof portfolioSpec.contentPlaceholders>(section: T) =>
  usePortfolioSpec().contentPlaceholders[section];
export const usePortfolioForm = (formId: keyof typeof portfolioSpec.forms) => usePortfolioSpec().forms[formId];

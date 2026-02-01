
export type LegalCategory = 'NDA' | 'Service Agreement' | 'Employment' | 'Sales' | 'Invoice Terms' | 'Other';
export type ClauseRisk = 'low' | 'med' | 'high';

export interface LegalKPI {
  templatesSaved: number;
  docsGenerated: number;
  clausesChecked: number;
  activeChecklists: number;
}

export interface LegalTemplate {
  id: string;
  title: string;
  category: LegalCategory;
  updatedAt: string;
}

export interface LegalChecklist {
  id: string;
  name: string;
  contractType: string;
  completedItems: number;
  totalItems: number;
}

export interface LegalSection {
  id: string;
  path: string;
  icon: string;
  labelKey: string;
}

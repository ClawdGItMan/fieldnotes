export type Source = {
  id: string;
  title: string;
  url: string;
  publishedAt?: string;
  asOf: string;
  checkedAt: string;
  scope?: string;
};
export type Section = {
  title: string;
  body: string[];
  kind?: 'evidence' | 'analysis' | 'outlook';
  sourceIds?: string[];
};
export type Article = {
  id: string;
  topic: 'payments' | 'solana' | 'institutions' | 'study';
  title: string;
  dek: string;
  takeaway: string;
  kind: 'Explainer' | 'Evidence' | 'Outlook' | 'Study note';
  asOf: string;
  checkedAt: string;
  readMinutes: number;
  sections: Section[];
  sourceIds: string[];
  related: string[];
  tags: string[];
  provenance: { kind: string; label: string };
};
export type Institution = {
  id: string;
  name: string;
  group:
    | 'Bank settlement'
    | 'Cash & remittances'
    | 'Capital markets'
    | 'Infrastructure';
  date: string;
  stage: 'Announced' | 'Pilot' | 'Live product' | 'Demonstrated transaction';
  summary: string;
  limit: string;
  sourceIds: string[];
};
export type Metric = {
  id: string;
  label: string;
  value: number;
  upper?: number;
  unit: string;
  period: string;
  scope: string;
  definition: string;
  sourceId: string;
  checkedAt: string;
  asOf: string;
  kind: 'historical' | 'target' | 'snapshot';
  series?: { period: string; value: number; upper?: number }[];
};

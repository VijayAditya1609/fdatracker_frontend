export interface CompanyOption {
  company_name: string;
  id: string;
}

export interface SubsystemCount {
  subsystem_count: string;
  process_type: string;
}

export interface InvestigatorCount {
  name: string;
  count: number;
}

export interface CompanyMetrics {
  wlMetrics: {
    total_violations: string;
    violations_per_wl: string;
    top_5_subsystems: SubsystemCount[];
    form_483s_converted: string;
    total_wl: string;
  };
  recallMetrics: {
    last_recall: string;
    total_recalls: string;
  };
  form483Metrics: {
    total_form483s: string;
    last_issue_date: string;
    top_5_subsystems: SubsystemCount[];
    observations_per_form483: string;
    total_observations: string;
  };
  investigatorMetrics: {
    total_investigators: number;
    top_5_investigators: InvestigatorCount[];
  };
  inspectionsMetrics: {
    vai_count: string;
    total_inspections: string;
    oai_count: string;
    nai_count: string;
  };
}
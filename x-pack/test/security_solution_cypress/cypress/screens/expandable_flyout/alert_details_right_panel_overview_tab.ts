/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EXPANDABLE_PANEL_CONTENT_TEST_ID,
  EXPANDABLE_PANEL_HEADER_TITLE_LINK_TEST_ID,
} from '@kbn/security-solution-plugin/public/flyout/shared/components/test_ids';
import {
  ABOUT_SECTION_HEADER_TEST_ID,
  DESCRIPTION_DETAILS_TEST_ID,
  DESCRIPTION_TITLE_TEST_ID,
  RULE_SUMMARY_BUTTON_TEST_ID,
  HIGHLIGHTED_FIELDS_DETAILS_TEST_ID,
  HIGHLIGHTED_FIELDS_TITLE_TEST_ID,
  INSIGHTS_HEADER_TEST_ID,
  INVESTIGATION_GUIDE_BUTTON_TEST_ID,
  INVESTIGATION_SECTION_HEADER_TEST_ID,
  MITRE_ATTACK_DETAILS_TEST_ID,
  MITRE_ATTACK_TITLE_TEST_ID,
  REASON_DETAILS_TEST_ID,
  REASON_TITLE_TEST_ID,
  VISUALIZATIONS_SECTION_HEADER_TEST_ID,
  HIGHLIGHTED_FIELDS_CELL_TEST_ID,
  RESPONSE_SECTION_HEADER_TEST_ID,
  INSIGHTS_THREAT_INTELLIGENCE_TEST_ID,
  CORRELATIONS_TEST_ID,
  PREVALENCE_TEST_ID,
  SUMMARY_ROW_VALUE_TEST_ID,
  CORRELATIONS_RELATED_ALERTS_BY_ANCESTRY_TEST_ID,
  CORRELATIONS_RELATED_ALERTS_BY_SAME_SOURCE_EVENT_TEST_ID,
  CORRELATIONS_RELATED_ALERTS_BY_SESSION_TEST_ID,
  CORRELATIONS_RELATED_CASES_TEST_ID,
  CORRELATIONS_SUPPRESSED_ALERTS_TEST_ID,
  INSIGHTS_ENTITIES_TEST_ID,
  REASON_DETAILS_PREVIEW_BUTTON_TEST_ID,
  ANALYZER_PREVIEW_TEST_ID,
  SESSION_PREVIEW_TEST_ID,
  RESPONSE_BUTTON_TEST_ID,
  WORKFLOW_STATUS_TITLE_TEST_ID,
  WORKFLOW_STATUS_DETAILS_TEST_ID,
} from '@kbn/security-solution-plugin/public/flyout/document_details/right/components/test_ids';
import { getDataTestSubjectSelector } from '../../helpers/common';

/* About section */

export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_ABOUT_SECTION_HEADER = getDataTestSubjectSelector(
  ABOUT_SECTION_HEADER_TEST_ID
);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_DESCRIPTION_TITLE =
  getDataTestSubjectSelector(DESCRIPTION_TITLE_TEST_ID);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_DESCRIPTION_DETAILS = getDataTestSubjectSelector(
  DESCRIPTION_DETAILS_TEST_ID
);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_OPEN_RULE_PREVIEW_BUTTON =
  getDataTestSubjectSelector(RULE_SUMMARY_BUTTON_TEST_ID);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_REASON_TITLE =
  getDataTestSubjectSelector(REASON_TITLE_TEST_ID);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_REASON_DETAILS =
  getDataTestSubjectSelector(REASON_DETAILS_TEST_ID);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_OPEN_ALERT_REASON_PREVIEW_BUTTON =
  getDataTestSubjectSelector(REASON_DETAILS_PREVIEW_BUTTON_TEST_ID);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_MITRE_ATTACK_TITLE = getDataTestSubjectSelector(
  MITRE_ATTACK_TITLE_TEST_ID
);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_MITRE_ATTACK_DETAILS = getDataTestSubjectSelector(
  MITRE_ATTACK_DETAILS_TEST_ID
);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_WORKFLOW_STATUS_TITLE =
  getDataTestSubjectSelector(WORKFLOW_STATUS_TITLE_TEST_ID);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_WORKFLOW_STATUS_DETAILS =
  getDataTestSubjectSelector(WORKFLOW_STATUS_DETAILS_TEST_ID);

/* Investigation section */

export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INVESTIGATION_SECTION_HEADER =
  getDataTestSubjectSelector(INVESTIGATION_SECTION_HEADER_TEST_ID);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_HIGHLIGHTED_FIELDS_HEADER_TITLE =
  getDataTestSubjectSelector(HIGHLIGHTED_FIELDS_TITLE_TEST_ID);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_HIGHLIGHTED_FIELDS_DETAILS =
  getDataTestSubjectSelector(HIGHLIGHTED_FIELDS_DETAILS_TEST_ID);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_HIGHLIGHTED_FIELDS_TABLE_FIELD_CELL =
  getDataTestSubjectSelector('fieldCell');
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_HIGHLIGHTED_FIELDS_TABLE_VALUE_CELL = (
  value: string
) => getDataTestSubjectSelector(`${value}-${HIGHLIGHTED_FIELDS_CELL_TEST_ID}`);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INVESTIGATION_GUIDE_BUTTON =
  getDataTestSubjectSelector(INVESTIGATION_GUIDE_BUTTON_TEST_ID);

/* Insights section */

export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_SECTION_HEADER =
  getDataTestSubjectSelector(INSIGHTS_HEADER_TEST_ID);

/* Insights Entities */

export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_ENTITIES_HEADER =
  getDataTestSubjectSelector(EXPANDABLE_PANEL_HEADER_TITLE_LINK_TEST_ID(INSIGHTS_ENTITIES_TEST_ID));

/* Insights Threat Intelligence */

export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_THREAT_INTELLIGENCE_HEADER =
  getDataTestSubjectSelector(
    EXPANDABLE_PANEL_HEADER_TITLE_LINK_TEST_ID(INSIGHTS_THREAT_INTELLIGENCE_TEST_ID)
  );
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_THREAT_INTELLIGENCE_VALUES =
  getDataTestSubjectSelector(SUMMARY_ROW_VALUE_TEST_ID(INSIGHTS_THREAT_INTELLIGENCE_TEST_ID));

/* Insights Correlations */

export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_CORRELATIONS_HEADER =
  getDataTestSubjectSelector(EXPANDABLE_PANEL_HEADER_TITLE_LINK_TEST_ID(CORRELATIONS_TEST_ID));
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_CORRELATIONS_VALUES_SUPPRESSED_ALERTS =
  getDataTestSubjectSelector(SUMMARY_ROW_VALUE_TEST_ID(CORRELATIONS_SUPPRESSED_ALERTS_TEST_ID));
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_CORRELATIONS_VALUES_RELATED_ALERTS_BY_ANCESTRY =
  getDataTestSubjectSelector(
    SUMMARY_ROW_VALUE_TEST_ID(CORRELATIONS_RELATED_ALERTS_BY_ANCESTRY_TEST_ID)
  );
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_CORRELATIONS_VALUES_RELATED_ALERTS_BY_SAME_SOURCE_EVENT =
  getDataTestSubjectSelector(
    SUMMARY_ROW_VALUE_TEST_ID(CORRELATIONS_RELATED_ALERTS_BY_SAME_SOURCE_EVENT_TEST_ID)
  );
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_CORRELATIONS_VALUES_RELATED_ALERTS_BY_SESSION =
  getDataTestSubjectSelector(
    SUMMARY_ROW_VALUE_TEST_ID(CORRELATIONS_RELATED_ALERTS_BY_SESSION_TEST_ID)
  );
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_CORRELATIONS_VALUES_RELATED_CASES =
  getDataTestSubjectSelector(SUMMARY_ROW_VALUE_TEST_ID(CORRELATIONS_RELATED_CASES_TEST_ID));

/* Insights Prevalence */

export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_PREVALENCE_HEADER =
  getDataTestSubjectSelector(EXPANDABLE_PANEL_HEADER_TITLE_LINK_TEST_ID(PREVALENCE_TEST_ID));
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_INSIGHTS_PREVALENCE_CONTENT =
  getDataTestSubjectSelector(EXPANDABLE_PANEL_CONTENT_TEST_ID(PREVALENCE_TEST_ID));

/* Visualization section */

export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_VISUALIZATIONS_SECTION_HEADER =
  getDataTestSubjectSelector(VISUALIZATIONS_SECTION_HEADER_TEST_ID);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_ANALYZER_PREVIEW_CONTAINER =
  getDataTestSubjectSelector(EXPANDABLE_PANEL_CONTENT_TEST_ID(ANALYZER_PREVIEW_TEST_ID));
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_SESSION_PREVIEW_CONTAINER =
  getDataTestSubjectSelector(EXPANDABLE_PANEL_CONTENT_TEST_ID(SESSION_PREVIEW_TEST_ID));

/* Response section */

export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_RESPONSE_SECTION_HEADER =
  getDataTestSubjectSelector(RESPONSE_SECTION_HEADER_TEST_ID);
export const DOCUMENT_DETAILS_FLYOUT_OVERVIEW_TAB_RESPONSE_BUTTON =
  getDataTestSubjectSelector(RESPONSE_BUTTON_TEST_ID);

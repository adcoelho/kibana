/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as i18n from './translations';
import { ALERTS } from '../../common/translations';
import { useCasesFeatures } from '../../common/use_cases_features';
import { useGetCaseConfiguration } from '../../containers/configure/use_get_case_configuration';

export type CasesColumnsConfiguration = Record<
  string,
  {
    field: string;
    name: string;
    canDisplay: boolean;
  }
>;

export const useCasesColumnsConfiguration = (): CasesColumnsConfiguration => {
  const { isAlertsEnabled, caseAssignmentAuthorized } = useCasesFeatures();
  const {
    data: { customFields },
  } = useGetCaseConfiguration();

  const canDisplayDefault = true;

  const result: CasesColumnsConfiguration = {
    title: {
      field: 'title',
      name: i18n.NAME,
      canDisplay: canDisplayDefault,
    },
    assignees: {
      field: 'assignees',
      name: i18n.ASSIGNEES,
      canDisplay: caseAssignmentAuthorized,
    },
    tags: {
      field: 'tags',
      name: i18n.TAGS,
      canDisplay: canDisplayDefault,
    },
    totalAlerts: {
      field: 'totalAlerts',
      name: ALERTS,
      canDisplay: isAlertsEnabled,
    },
    totalComment: {
      field: 'totalComment',
      name: i18n.COMMENTS,
      canDisplay: canDisplayDefault,
    },
    category: {
      field: 'category',
      name: i18n.CATEGORY,
      canDisplay: canDisplayDefault,
    },
    closedAt: {
      field: 'closedAt',
      name: i18n.CLOSED_ON,
      canDisplay: canDisplayDefault,
    },
    createdAt: {
      field: 'createdAt',
      name: i18n.CREATED_ON,
      canDisplay: canDisplayDefault,
    },
    updatedAt: {
      field: 'updatedAt',
      name: i18n.UPDATED_ON,
      canDisplay: canDisplayDefault,
    },
    externalIncident: {
      field: 'externalIncident',
      name: i18n.EXTERNAL_INCIDENT,
      canDisplay: canDisplayDefault,
    },
    status: {
      field: 'status',
      name: i18n.STATUS,
      canDisplay: canDisplayDefault,
    },
    severity: {
      field: 'severity',
      name: i18n.SEVERITY,
      canDisplay: canDisplayDefault,
    },
  };

  // we need to extend the configuration with the customFields
  customFields.forEach(({ key, label }) => {
    result[key] = {
      field: key,
      name: label,
      canDisplay: canDisplayDefault,
    };
  });

  return result;
};

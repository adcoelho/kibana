/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback, useMemo } from 'react';
import type {
  EuiTableActionsColumnType,
  EuiTableComputedColumnType,
  EuiTableFieldDataColumnType,
} from '@elastic/eui';
import {
  EuiBadgeGroup,
  EuiBadge,
  EuiButton,
  EuiLink,
  EuiIcon,
  EuiHealth,
  EuiToolTip,
  RIGHT_ALIGNMENT,
} from '@elastic/eui';
import styled from 'styled-components';
import { Status } from '@kbn/cases-components/src/status/status';
import type { UserProfileWithAvatar } from '@kbn/user-profile-components';
import { euiStyled } from '@kbn/kibana-react-plugin/common';

import type { ActionConnector } from '../../../common/types/domain';
import { CaseSeverity } from '../../../common/types/domain';
import type { CaseUI } from '../../../common/ui/types';
import type { CasesColumnSelection } from './types';
import { getEmptyTagValue } from '../empty_value';
import { FormattedRelativePreferenceDate } from '../formatted_date';
import { CaseDetailsLink } from '../links';
import * as i18n from './translations';
import { useActions } from './use_actions';
import { useCasesColumnsConfiguration } from './use_cases_columns_configuration';
import { useApplicationCapabilities, useKibana } from '../../common/lib/kibana';
import { TruncatedText } from '../truncated_text';
import { getConnectorIcon } from '../utils';
import { severities } from '../severity/config';
import { AssigneesColumn } from './assignees_column';
import { builderMap as customFieldsBuilderMap } from '../custom_fields/builder';
import { useGetCaseConfiguration } from '../../containers/configure/use_get_case_configuration';

type CasesColumns =
  | EuiTableActionsColumnType<CaseUI>
  | EuiTableComputedColumnType<CaseUI>
  | EuiTableFieldDataColumnType<CaseUI>;

const LINE_CLAMP = 3;
const LineClampedEuiBadgeGroup = euiStyled(EuiBadgeGroup)`
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${LINE_CLAMP};
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: normal;
`;

// margin-right is required here because -webkit-box-orient: vertical;
// in the EuiBadgeGroup prevents us from defining gutterSize.
const StyledEuiBadge = euiStyled(EuiBadge)`
  max-width: 100px;
  margin-right: 5px;
`; // to allow for ellipsis

const renderStringField = (field: string, dataTestSubj: string) =>
  field != null ? <span data-test-subj={dataTestSubj}>{field}</span> : getEmptyTagValue();

export interface GetCasesColumn {
  filterStatus: string;
  userProfiles: Map<string, UserProfileWithAvatar>;
  isSelectorView: boolean;
  selectedColumns: CasesColumnSelection[];
  connectors?: ActionConnector[];
  onRowClick?: (theCase: CaseUI) => void;
  disableActions?: boolean;
}

export interface UseCasesColumnsReturnValue {
  columns: CasesColumns[];
  isLoadingColumns: boolean;
}

export const useCasesColumns = ({
  userProfiles,
  isSelectorView,
  connectors = [],
  onRowClick,
  disableActions = false,
  selectedColumns,
}: GetCasesColumn): UseCasesColumnsReturnValue => {
  const casesColumnsConfig = useCasesColumnsConfiguration(isSelectorView);
  const { actions } = useActions({ disableActions });

  const {
    data: { customFields },
    isFetching: isLoadingColumns,
  } = useGetCaseConfiguration();

  const assignCaseAction = useCallback(
    async (theCase: CaseUI) => {
      if (onRowClick) {
        onRowClick(theCase);
      }
    },
    [onRowClick]
  );

  const columnsDict: Record<string, CasesColumns> = useMemo(
    () => ({
      title: {
        field: casesColumnsConfig.title.field,
        name: casesColumnsConfig.title.name,
        sortable: true,
        render: (title: string, theCase: CaseUI) => {
          if (theCase.id != null && theCase.title != null) {
            const caseDetailsLinkComponent = isSelectorView ? (
              theCase.title
            ) : (
              <CaseDetailsLink detailName={theCase.id} title={theCase.title}>
                <TruncatedText text={theCase.title} />
              </CaseDetailsLink>
            );

            return caseDetailsLinkComponent;
          }
          return getEmptyTagValue();
        },
        width: !isSelectorView ? '20%' : '55%',
      },
      assignees: {
        field: casesColumnsConfig.assignees.field,
        name: casesColumnsConfig.assignees.name,
        render: (assignees: CaseUI['assignees']) => (
          <AssigneesColumn assignees={assignees} userProfiles={userProfiles} />
        ),
        width: '180px',
      },
      tags: {
        field: casesColumnsConfig.tags.field,
        name: casesColumnsConfig.tags.name,
        render: (tags: CaseUI['tags']) => {
          if (tags != null && tags.length > 0) {
            const clampedBadges = (
              <LineClampedEuiBadgeGroup data-test-subj="case-table-column-tags">
                {tags.map((tag: string, i: number) => (
                  <StyledEuiBadge
                    color="hollow"
                    key={`${tag}-${i}`}
                    data-test-subj={`case-table-column-tags-${tag}`}
                  >
                    {tag}
                  </StyledEuiBadge>
                ))}
              </LineClampedEuiBadgeGroup>
            );

            const unclampedBadges = (
              <EuiBadgeGroup data-test-subj="case-table-column-tags">
                {tags.map((tag: string, i: number) => (
                  <EuiBadge
                    color="hollow"
                    key={`${tag}-${i}`}
                    data-test-subj={`case-table-column-tags-${tag}`}
                  >
                    {tag}
                  </EuiBadge>
                ))}
              </EuiBadgeGroup>
            );

            return (
              <EuiToolTip
                data-test-subj="case-table-column-tags-tooltip"
                position="left"
                content={unclampedBadges}
              >
                {clampedBadges}
              </EuiToolTip>
            );
          }
          return getEmptyTagValue();
        },
        width: '15%',
      },
      totalAlerts: {
        field: casesColumnsConfig.totalAlerts.field,
        name: casesColumnsConfig.totalAlerts.name,
        align: RIGHT_ALIGNMENT,
        render: (totalAlerts: CaseUI['totalAlerts']) =>
          totalAlerts != null
            ? renderStringField(`${totalAlerts}`, `case-table-column-alertsCount`)
            : getEmptyTagValue(),
        width: !isSelectorView ? '80px' : '55px',
      },
      totalComment: {
        field: casesColumnsConfig.totalComment.field,
        name: casesColumnsConfig.totalComment.name,
        align: RIGHT_ALIGNMENT,
        render: (totalComment: CaseUI['totalComment']) =>
          totalComment != null
            ? renderStringField(`${totalComment}`, `case-table-column-commentCount`)
            : getEmptyTagValue(),
      },
      category: {
        field: casesColumnsConfig.category.field,
        name: casesColumnsConfig.category.name,
        sortable: true,
        render: (category: CaseUI['category']) => {
          if (category != null) {
            return (
              <span data-test-subj={`case-table-column-category-${category}`}>{category}</span>
            );
          }
          return getEmptyTagValue();
        },
        width: '100px',
      },
      closedAt: {
        field: casesColumnsConfig.closedAt.field,
        name: casesColumnsConfig.closedAt.name,
        sortable: true,
        render: (closedAt: CaseUI['closedAt']) => {
          if (closedAt != null) {
            return (
              <span data-test-subj={`case-table-column-closedAt`}>
                <FormattedRelativePreferenceDate value={closedAt} />
              </span>
            );
          }
          return getEmptyTagValue();
        },
      },
      createdAt: {
        field: casesColumnsConfig.createdAt.field,
        name: casesColumnsConfig.createdAt.name,
        sortable: true,
        render: (createdAt: CaseUI['createdAt']) => {
          if (createdAt != null) {
            return (
              <span data-test-subj={`case-table-column-createdAt`}>
                <FormattedRelativePreferenceDate value={createdAt} stripMs={true} />
              </span>
            );
          }
          return getEmptyTagValue();
        },
      },
      updatedAt: {
        field: casesColumnsConfig.updatedAt.field,
        name: casesColumnsConfig.updatedAt.name,
        sortable: true,
        render: (updatedAt: CaseUI['updatedAt']) => {
          if (updatedAt != null) {
            return (
              <span data-test-subj="case-table-column-updatedAt">
                <FormattedRelativePreferenceDate value={updatedAt} stripMs={true} />
              </span>
            );
          }
          return getEmptyTagValue();
        },
      },
      externalIncident: {
        // no field
        name: casesColumnsConfig.externalIncident.name,
        render: (theCase: CaseUI) => {
          if (theCase.id != null) {
            return <ExternalServiceColumn theCase={theCase} connectors={connectors} />;
          }
          return getEmptyTagValue();
        },
        width: isSelectorView ? '80px' : undefined,
      },
      status: {
        field: casesColumnsConfig.status.field,
        name: casesColumnsConfig.status.name,
        sortable: true,
        render: (status: CaseUI['status']) => {
          if (status != null) {
            return <Status status={status} />;
          }

          return getEmptyTagValue();
        },
      },
      severity: {
        field: casesColumnsConfig.severity.field,
        name: casesColumnsConfig.severity.name,
        sortable: true,
        render: (severity: CaseUI['severity']) => {
          if (severity != null) {
            const severityData = severities[severity ?? CaseSeverity.LOW];
            return (
              <EuiHealth
                data-test-subj={`case-table-column-severity-${severity}`}
                color={severityData.color}
              >
                {severityData.label}
              </EuiHealth>
            );
          }
          return getEmptyTagValue();
        },
        width: '90px',
      },
      assignCaseAction: {
        // no field
        align: RIGHT_ALIGNMENT,
        render: (theCase: CaseUI) => {
          if (theCase.id != null) {
            return (
              <EuiButton
                data-test-subj={`cases-table-row-select-${theCase.id}`}
                onClick={() => {
                  assignCaseAction(theCase);
                }}
                size="s"
              >
                {i18n.SELECT}
              </EuiButton>
            );
          }
          return getEmptyTagValue();
        },
      },
    }),
    [assignCaseAction, casesColumnsConfig, connectors, isSelectorView, userProfiles]
  );

  // we need to extend the columnsDict with the columns of
  // the customFields
  customFields.forEach(({ key, type, label }) => {
    if (type in customFieldsBuilderMap) {
      const columnDefinition = customFieldsBuilderMap[type]().getEuiTableColumn({ label });

      columnsDict[key] = {
        ...columnDefinition,
        render: (theCase: CaseUI) => {
          const customField = theCase.customFields.find(
            (element) => element.key === key && element.value !== null
          );

          if (!customField) {
            return getEmptyTagValue();
          }

          return columnDefinition.render(customField);
        },
      };
    }
  });

  const columns: CasesColumns[] = [];

  selectedColumns.forEach(({ field, isChecked }) => {
    if (
      field in columnsDict &&
      (isChecked || isSelectorView) &&
      casesColumnsConfig[field].canDisplay
    ) {
      columns.push(columnsDict[field]);
    }
  });

  if (isSelectorView) {
    columns.push(columnsDict.assignCaseAction);
  } else if (actions) {
    columns.push(actions);
  }

  return { columns, isLoadingColumns };
};

interface Props {
  theCase: CaseUI;
  connectors: ActionConnector[];
}

const IconWrapper = styled.span`
  svg {
    height: 20px !important;
    position: relative;
    top: 3px;
    width: 20px !important;
  }
`;

export const ExternalServiceColumn: React.FC<Props> = ({ theCase, connectors }) => {
  const { triggersActionsUi } = useKibana().services;
  const { actions } = useApplicationCapabilities();

  if (theCase.externalService == null) {
    return renderStringField(i18n.NOT_PUSHED, `case-table-column-external-notPushed`);
  }

  const lastPushedConnector: ActionConnector | undefined = connectors.find(
    (connector) => connector.id === theCase.externalService?.connectorId
  );
  const lastCaseUpdate = theCase.updatedAt != null ? new Date(theCase.updatedAt) : null;
  const lastCasePush =
    theCase.externalService?.pushedAt != null ? new Date(theCase.externalService?.pushedAt) : null;
  const hasDataToPush =
    lastCasePush === null ||
    (lastCaseUpdate != null && lastCasePush.getTime() < lastCaseUpdate?.getTime());

  return (
    <p>
      {actions.read && (
        <IconWrapper>
          <EuiIcon
            size="original"
            title={theCase.externalService?.connectorName}
            type={getConnectorIcon(triggersActionsUi, lastPushedConnector?.actionTypeId)}
            data-test-subj="cases-table-connector-icon"
          />
        </IconWrapper>
      )}
      <EuiLink
        data-test-subj={`case-table-column-external`}
        title={theCase.externalService?.connectorName}
        href={theCase.externalService?.externalUrl}
        target="_blank"
        aria-label={i18n.PUSH_LINK_ARIA(theCase.externalService?.connectorName)}
      >
        {theCase.externalService?.externalTitle}
      </EuiLink>
      {hasDataToPush
        ? renderStringField(i18n.REQUIRES_UPDATE, `case-table-column-external-requiresUpdate`)
        : renderStringField(i18n.UP_TO_DATE, `case-table-column-external-upToDate`)}
    </p>
  );
};
ExternalServiceColumn.displayName = 'ExternalServiceColumn';

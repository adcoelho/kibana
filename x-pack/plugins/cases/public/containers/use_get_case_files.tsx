/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { FileJSON } from '@kbn/shared-ux-file-types';
import type { UseQueryResult } from '@tanstack/react-query';

import { useFilesContext } from '@kbn/shared-ux-file-context';
import { useQuery } from '@tanstack/react-query';

import type { ServerError } from '../types';

import { APP_ID } from '../../common';
import { useCasesToast } from '../common/use_cases_toast';
import { CASES_FILE_KINDS } from '../files';
import { casesQueriesKeys } from './constants';
import * as i18n from './translations';

export interface CaseFilesFilteringOptions {
  page: number;
  perPage: number;
  searchTerm?: string;
}

export interface GetCaseFilesParams extends CaseFilesFilteringOptions {
  caseId: string;
}

export const useGetCaseFiles = ({
  caseId,
  page,
  perPage,
  searchTerm,
}: GetCaseFilesParams): UseQueryResult<{ files: FileJSON[]; total: number }> => {
  const { showErrorToast } = useCasesToast();
  const { client: filesClient } = useFilesContext();

  return useQuery(
    casesQueriesKeys.caseFiles(caseId, { page, perPage, searchTerm }),
    () => {
      return filesClient.list({
        kind: CASES_FILE_KINDS[APP_ID].id,
        page: page + 1,
        ...(searchTerm && { name: `*${searchTerm}*` }),
        perPage,
        meta: { caseId },
      });
    },
    {
      keepPreviousData: true,
      onError: (error: ServerError) => {
        showErrorToast(error, { title: i18n.ERROR_TITLE });
      },
    }
  );
};

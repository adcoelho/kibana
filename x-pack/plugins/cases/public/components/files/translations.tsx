/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';

export const ACTIONS = i18n.translate('xpack.cases.caseView.files.actions', {
  defaultMessage: 'Actions',
});

export const ADD_FILE = i18n.translate('xpack.cases.caseView.files.addFile', {
  defaultMessage: 'Add File',
});

export const CLOSE_MODAL = i18n.translate('xpack.cases.caseView.files.closeModal', {
  defaultMessage: 'Close',
});

export const DATE_ADDED = i18n.translate('xpack.cases.caseView.files.dateAdded', {
  defaultMessage: 'Date Added',
});

export const DELETE_FILE = i18n.translate('xpack.cases.caseView.files.deleteFile', {
  defaultMessage: 'Delete File',
});

export const DOWNLOAD_FILE = i18n.translate('xpack.cases.caseView.files.downloadFile', {
  defaultMessage: 'Download File',
});

export const FILES_TABLE = i18n.translate('xpack.cases.caseView.files.filesTable', {
  defaultMessage: 'Files table',
});

export const NAME = i18n.translate('xpack.cases.caseView.files.name', {
  defaultMessage: 'Name',
});

export const NO_FILES = i18n.translate('xpack.cases.caseView.files.noFilesAvailable', {
  defaultMessage: 'No files available',
});

export const NO_PREVIEW = i18n.translate('xpack.cases.caseView.files.noPreviewAvailable', {
  defaultMessage: 'No preview available',
});

export const RESULTS_COUNT = i18n.translate('xpack.cases.caseView.files.resultsCount', {
  defaultMessage: 'Showing',
});

export const TYPE = i18n.translate('xpack.cases.caseView.files.type', {
  defaultMessage: 'Type',
});

export const SEARCH_PLACEHOLDER = i18n.translate('xpack.cases.caseViewFiles.searchPlaceholder', {
  defaultMessage: 'Search files',
});

export const FAILED_UPLOAD = i18n.translate('xpack.cases.caseView.failedUpload', {
  defaultMessage: 'Failed to upload file',
});

export const SUCCESSFUL_UPLOAD = i18n.translate('xpack.cases.caseView.successfulUpload', {
  defaultMessage: 'File uploaded successfuly!',
});

export const SUCCESSFUL_UPLOAD_FILE_NAME = (fileName: string) =>
  i18n.translate('xpack.cases.caseView.successfulUploadFileName', {
    defaultMessage: 'File {fileName} uploaded successfully',
    values: { fileName },
  });

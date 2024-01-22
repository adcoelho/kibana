/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { differenceWith, intersectionWith, isEmpty } from 'lodash';
import Boom from '@hapi/boom';
import type { CustomFieldsConfiguration } from '../../../common/types/domain';
import type { CaseRequestCustomFields, CasesSearchRequest } from '../../../common/types/api';
import { validateDuplicatedCustomFieldKeysInRequest } from '../validators';
import type { ICasesCustomField } from '../../custom_fields';
import { casesCustomFields } from '../../custom_fields';
import { MAX_CUSTOM_FIELDS_PER_CASE } from '../../../common/constants';

interface CustomFieldValidationParams {
  requestCustomFields?: CaseRequestCustomFields;
  customFieldsConfiguration?: CustomFieldsConfiguration;
}

export const validateCustomFields = (params: CustomFieldValidationParams) => {
  validateDuplicatedCustomFieldKeysInRequest(params);
  validateCustomFieldKeysAgainstConfiguration(params);
  validateRequiredCustomFields(params);
  validateCustomFieldTypesInRequest(params);
};

/**
 * Throws if the type doesn't match the configuration.
 */
export function validateCustomFieldTypesInRequest({
  requestCustomFields,
  customFieldsConfiguration,
}: CustomFieldValidationParams) {
  if (!Array.isArray(requestCustomFields) || !requestCustomFields.length) {
    return;
  }

  if (customFieldsConfiguration === undefined) {
    throw Boom.badRequest('No custom fields configured.');
  }

  let invalidCustomFieldKeys: string[] = [];

  const validCustomFields = intersectionWith(
    customFieldsConfiguration,
    requestCustomFields,
    (requiredVal, requestedVal) =>
      requiredVal.key === requestedVal.key && requiredVal.type === requestedVal.type
  );

  if (requestCustomFields.length !== validCustomFields.length) {
    invalidCustomFieldKeys = differenceWith(
      requestCustomFields,
      validCustomFields,
      (requiredVal, requestedVal) => requiredVal.key === requestedVal.key
    ).map((e) => e.key);
  }

  if (invalidCustomFieldKeys.length) {
    const invalidCustomFieldLabels: string[] = [];

    invalidCustomFieldKeys.forEach((invalidFieldKey) => {
      const configuration = customFieldsConfiguration.find((item) => item.key === invalidFieldKey);

      if (configuration !== undefined) {
        invalidCustomFieldLabels.push(`"${configuration.label}"`);
      }
    });

    throw Boom.badRequest(
      `The following custom fields have the wrong type in the request: ${invalidCustomFieldLabels.join(
        ', '
      )}`
    );
  }
}

/**
 * Throws if the key doesn't match the configuration or is missing
 */
export const validateCustomFieldKeysAgainstConfiguration = ({
  requestCustomFields,
  customFieldsConfiguration,
}: CustomFieldValidationParams) => {
  if (!Array.isArray(requestCustomFields) || !requestCustomFields.length) {
    return [];
  }

  if (customFieldsConfiguration === undefined) {
    throw Boom.badRequest('No custom fields configured.');
  }

  const invalidCustomFieldKeys = differenceWith(
    requestCustomFields,
    customFieldsConfiguration,
    (requestVal, configurationVal) => requestVal.key === configurationVal.key
  ).map((e) => e.key);

  if (invalidCustomFieldKeys.length) {
    throw Boom.badRequest(`Invalid custom field keys: ${invalidCustomFieldKeys}`);
  }
};

/**
 * Returns a list of required custom fields missing from the request
 */
export const validateRequiredCustomFields = ({
  requestCustomFields,
  customFieldsConfiguration,
}: CustomFieldValidationParams) => {
  if (customFieldsConfiguration === undefined) {
    if (!Array.isArray(requestCustomFields) || !requestCustomFields.length) {
      return;
    } else {
      throw Boom.badRequest('No custom fields configured.');
    }
  }

  const requiredCustomFields = customFieldsConfiguration.filter(
    (customField) => customField.required
  );

  if (!requiredCustomFields.length) {
    return;
  }

  const missingRequiredCustomFields = differenceWith(
    requiredCustomFields,
    requestCustomFields ?? [],
    (requiredVal, requestedVal) => requiredVal.key === requestedVal.key
  ).map((e) => `"${e.label}"`);

  requiredCustomFields.forEach((requiredField) => {
    const found = requestCustomFields?.find(
      (requestField) => requestField.key === requiredField.key
    );

    if (found && found.value === null) {
      missingRequiredCustomFields.push(`"${requiredField.label}"`);
    }
  });

  if (missingRequiredCustomFields.length) {
    throw Boom.badRequest(
      `Missing required custom fields: ${missingRequiredCustomFields.join(', ')}`
    );
  }
};

export const validateSearchCasesCustomFields = ({
  customFieldsConfiguration,
  customFields,
}: {
  customFieldsConfiguration: CustomFieldsConfiguration;
  customFields: CasesSearchRequest['customFields'];
}) => {
  let customFieldsMapping: ICasesCustomField | null = null;

  if (!customFields || isEmpty(customFields)) {
    return;
  }

  if (!customFieldsConfiguration.length) {
    throw Boom.badRequest('No custom fields configured.');
  }

  if (Object.keys(customFields).length > MAX_CUSTOM_FIELDS_PER_CASE) {
    throw Boom.badRequest(`Maximum ${MAX_CUSTOM_FIELDS_PER_CASE} customFields are allowed.`);
  }

  Object.entries(customFields).forEach(([key, value]) => {
    const customFieldConfig = customFieldsConfiguration.find((config) => config.key === key);

    if (!customFieldConfig) {
      throw Boom.badRequest(`Invalid custom field key: ${key}.`);
    }

    customFieldsMapping = casesCustomFields.get(customFieldConfig.type);

    if (!customFieldsMapping?.isFilterable) {
      throw Boom.badRequest(
        `Filtering by custom field of type ${customFieldConfig.type} is not allowed.`
      );
    }

    customFieldsMapping?.validateFilteringValues(value);
  });
};

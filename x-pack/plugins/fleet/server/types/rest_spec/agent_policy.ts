/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';

import { NewAgentPolicySchema } from '../models';

import { AGENT_POLICY_SAVED_OBJECT_TYPE, AGENT_POLICY_MAPPINGS } from '../../constants';

import { validateKuery } from '../../routes/utils/filter_utils';

import { BulkRequestBodySchema } from './common';

export const GetAgentPoliciesRequestSchema = {
  query: schema.object({
    page: schema.maybe(schema.number({ defaultValue: 1 })),
    perPage: schema.maybe(schema.number({ defaultValue: 20 })),
    sortField: schema.maybe(schema.string()),
    sortOrder: schema.maybe(schema.oneOf([schema.literal('desc'), schema.literal('asc')])),
    showUpgradeable: schema.maybe(schema.boolean()),
    kuery: schema.maybe(
      schema.string({
        validate: (value: string) => {
          const validationObj = validateKuery(
            value,
            [AGENT_POLICY_SAVED_OBJECT_TYPE],
            AGENT_POLICY_MAPPINGS,
            true
          );
          if (validationObj?.error) {
            return validationObj?.error;
          }
        },
      })
    ),
    noAgentCount: schema.maybe(schema.boolean()),
    full: schema.maybe(schema.boolean()),
  }),
};

export const BulkGetAgentPoliciesRequestSchema = {
  body: BulkRequestBodySchema.extends({
    full: schema.maybe(schema.boolean()),
  }),
};

export const GetOneAgentPolicyRequestSchema = {
  params: schema.object({
    agentPolicyId: schema.string(),
  }),
};

export const CreateAgentPolicyRequestSchema = {
  body: NewAgentPolicySchema,
  query: schema.object({
    sys_monitoring: schema.maybe(schema.boolean()),
  }),
};

export const UpdateAgentPolicyRequestSchema = {
  ...GetOneAgentPolicyRequestSchema,
  body: NewAgentPolicySchema.extends({
    force: schema.maybe(schema.boolean()),
  }),
};

export const CopyAgentPolicyRequestSchema = {
  ...GetOneAgentPolicyRequestSchema,
  body: schema.object({
    name: schema.string({ minLength: 1 }),
    description: schema.maybe(schema.string()),
  }),
};

export const DeleteAgentPolicyRequestSchema = {
  body: schema.object({
    agentPolicyId: schema.string(),
  }),
};

export const GetFullAgentPolicyRequestSchema = {
  params: schema.object({
    agentPolicyId: schema.string(),
  }),
  query: schema.object({
    download: schema.maybe(schema.boolean()),
    standalone: schema.maybe(schema.boolean()),
    kubernetes: schema.maybe(schema.boolean()),
  }),
};

export const GetK8sManifestRequestSchema = {
  query: schema.object({
    download: schema.maybe(schema.boolean()),
    fleetServer: schema.maybe(schema.string()),
    enrolToken: schema.maybe(schema.string()),
  }),
};

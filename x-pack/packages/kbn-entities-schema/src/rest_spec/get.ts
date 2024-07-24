/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { z } from 'zod';

export const getEntityDefinitionQuerySchema = z.object({
  page: z.optional(z.coerce.number()),
  perPage: z.optional(z.coerce.number()),
});

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PathReporter } from 'io-ts/lib/PathReporter';
import { AttachmentType } from '../attachment/v1';
import { ConnectorTypes } from '../connector/v1';
import {
  CaseAttributesRt,
  CaseSettingsRt,
  CaseSeverity,
  CasesRt,
  CaseStatuses,
  CustomFieldRt,
  RelatedCaseRt,
} from './v1';

const basicCase = {
  owner: 'cases',
  closed_at: null,
  closed_by: null,
  id: 'basic-case-id',
  comments: [
    {
      comment: 'Solve this fast!',
      type: AttachmentType.user,
      id: 'basic-comment-id',
      created_at: '2020-02-19T23:06:33.798Z',
      created_by: {
        full_name: 'Leslie Knope',
        username: 'lknope',
        email: 'leslie.knope@elastic.co',
      },
      owner: 'cases',
      pushed_at: null,
      pushed_by: null,
      updated_at: null,
      updated_by: null,
      version: 'WzQ3LDFc',
    },
  ],
  created_at: '2020-02-19T23:06:33.798Z',
  created_by: {
    full_name: 'Leslie Knope',
    username: 'lknope',
    email: 'leslie.knope@elastic.co',
  },
  connector: {
    id: 'none',
    name: 'My Connector',
    type: ConnectorTypes.none,
    fields: null,
  },
  description: 'Security banana Issue',
  severity: CaseSeverity.LOW,
  duration: null,
  external_service: null,
  status: CaseStatuses.open,
  tags: ['coke', 'pepsi'],
  title: 'Another horrible breach!!',
  totalComment: 1,
  totalAlerts: 0,
  updated_at: '2020-02-20T15:02:57.995Z',
  updated_by: {
    full_name: 'Leslie Knope',
    username: 'lknope',
    email: 'leslie.knope@elastic.co',
  },
  version: 'WzQ3LDFd',
  settings: {
    syncAlerts: true,
  },
  // damaged_raccoon uid
  assignees: [{ uid: 'u_J41Oh6L9ki-Vo2tOogS8WRTENzhHurGtRc87NgEAlkc_0' }],
  category: null,
  customFields: [
    {
      key: 'first_custom_field_key',
      type: 'text',
      field: { value: ['this is a text field value', 'this is second'] },
    },
    {
      key: 'second_custom_field_key',
      type: 'toggle',
      field: { value: [true] },
    },
  ],
};

describe('RelatedCaseRt', () => {
  const defaultRequest = {
    id: 'basic-case-id',
    title: 'basic-case-title',
    description: 'this is a simple description',
    status: CaseStatuses.open,
    createdAt: '2023-01-17T09:46:29.813Z',
    totals: {
      alerts: 5,
      userComments: 2,
    },
  };
  it('has expected attributes in request', () => {
    const query = RelatedCaseRt.decode(defaultRequest);

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: defaultRequest,
    });
  });

  it('removes foo:bar attributes from request', () => {
    const query = RelatedCaseRt.decode({ ...defaultRequest, foo: 'bar' });

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: defaultRequest,
    });
  });

  it('removes foo:bar attributes from totals', () => {
    const query = RelatedCaseRt.decode({
      ...defaultRequest,
      totals: { ...defaultRequest.totals, foo: 'bar' },
    });

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: defaultRequest,
    });
  });
});

describe('SettingsRt', () => {
  it('has expected attributes in request', () => {
    const query = CaseSettingsRt.decode({ syncAlerts: true });

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: { syncAlerts: true },
    });
  });

  it('removes foo:bar attributes from request', () => {
    const query = CaseSettingsRt.decode({ syncAlerts: false, foo: 'bar' });

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: { syncAlerts: false },
    });
  });
});

describe('CaseAttributesRt', () => {
  const defaultRequest = {
    description: 'A description',
    status: CaseStatuses.open,
    tags: ['new', 'case'],
    title: 'My new case',
    connector: {
      id: '123',
      name: 'My connector',
      type: ConnectorTypes.jira,
      fields: { issueType: 'Task', priority: 'High', parent: null },
    },
    settings: {
      syncAlerts: true,
    },
    owner: 'cases',
    severity: CaseSeverity.LOW,
    assignees: [{ uid: 'u_J41Oh6L9ki-Vo2tOogS8WRTENzhHurGtRc87NgEAlkc_0' }],
    duration: null,
    closed_at: null,
    closed_by: null,
    created_at: '2020-02-19T23:06:33.798Z',
    created_by: {
      full_name: 'Leslie Knope',
      username: 'lknope',
      email: 'leslie.knope@elastic.co',
    },
    external_service: null,
    updated_at: '2020-02-20T15:02:57.995Z',
    updated_by: null,
    category: null,
    customFields: [
      {
        key: 'first_custom_field_key',
        type: 'text',
        field: { value: ['this is a text field value', 'this is second'] },
      },
      {
        key: 'second_custom_field_key',
        type: 'toggle',
        field: { value: [true] },
      },
    ],
  };

  it('has expected attributes in request', () => {
    const query = CaseAttributesRt.decode(defaultRequest);

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: defaultRequest,
    });
  });

  it('removes foo:bar attributes from request', () => {
    const query = CaseAttributesRt.decode({ ...defaultRequest, foo: 'bar' });

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: defaultRequest,
    });
  });

  it('removes foo:bar attributes from connector', () => {
    const query = CaseAttributesRt.decode({
      ...defaultRequest,
      connector: { ...defaultRequest.connector, foo: 'bar' },
    });

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: defaultRequest,
    });
  });

  it('removes foo:bar attributes from created_by', () => {
    const query = CaseAttributesRt.decode({
      ...defaultRequest,
      created_by: { ...defaultRequest.created_by, foo: 'bar' },
    });

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: defaultRequest,
    });
  });
});

describe('CasesRt', () => {
  const defaultRequest = [
    {
      ...basicCase,
    },
  ];

  it('has expected attributes in request', () => {
    const query = CasesRt.decode(defaultRequest);

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: defaultRequest,
    });
  });

  it('removes foo:bar attributes from request', () => {
    const query = CasesRt.decode([{ ...defaultRequest[0], foo: 'bar' }]);

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: defaultRequest,
    });
  });
});

describe('CustomFieldRt', () => {
  it.each([
    [
      'type text value text',
      {
        key: 'string_custom_field_1',
        type: 'text',
        field: { value: ['this is a text field value'] },
      },
    ],
    [
      'type text value null',
      {
        key: 'string_custom_field_2',
        type: 'text',
        field: { value: null },
      },
    ],
    [
      'type toggle value boolean',
      {
        key: 'toggle_custom_field_1',
        type: 'toggle',
        field: { value: [true] },
      },
    ],
    [
      'type toggle value null',
      {
        key: 'toggle_custom_field_2',
        type: 'toggle',
        field: { value: null },
      },
    ],
    [
      'type list value list',
      {
        key: 'list_custom_field_1',
        type: 'list',
        field: { value: ['this is a text field value'] },
      },
    ],
    [
      'type list value null',
      {
        key: 'list_custom_field_1',
        type: 'list',
        field: { value: null },
      },
    ],
  ])(`has expected attributes for customField with %s`, (_, customField) => {
    const query = CustomFieldRt.decode(customField);

    expect(query).toStrictEqual({
      _tag: 'Right',
      right: customField,
    });
  });

  it('fails if text type and value dont match expected attributes in request', () => {
    const query = CustomFieldRt.decode({
      key: 'text_custom_field_1',
      type: 'text',
      field: { value: [666] },
    });

    expect(PathReporter.report(query)[0]).toContain('Invalid value 666 supplied');
  });

  it('fails if list type and value dont match expected attributes in request', () => {
    const query = CustomFieldRt.decode({
      key: 'list_custom_field_1',
      type: 'list',
      field: { value: [true] },
    });

    expect(PathReporter.report(query)[0]).toContain('Invalid value true supplied');
  });

  it('fails if toggle type and value dont match expected attributes in request', () => {
    const query = CustomFieldRt.decode({
      key: 'list_custom_field_1',
      type: 'toggle',
      field: { value: ['hello'] },
    });

    expect(PathReporter.report(query)[0]).toContain('Invalid value "hello" supplied');
  });
});

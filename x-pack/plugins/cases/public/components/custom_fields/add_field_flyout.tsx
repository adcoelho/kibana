/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback, useState } from 'react';
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlyoutFooter,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonEmpty,
  EuiButton,
} from '@elastic/eui';
import type { CustomFieldFormState } from './form';
import { CustomFieldsForm } from './form';
import type { CustomFieldsConfiguration } from '../../../common/types/domain';

import * as i18n from './translations';

export interface AddFieldFlyoutProps {
  disabled: boolean;
  isLoading: boolean;
  onCloseFlyout: () => void;
  onSaveField: (data: CustomFieldsConfiguration) => void;
}

const AddFieldFlyoutComponent: React.FC<AddFieldFlyoutProps> = ({
  onCloseFlyout,
  onSaveField,
  isLoading,
  disabled,
}) => {
  const dataTestSubj = 'add-custom-field-flyout';

  const [formState, setFormState] = useState<CustomFieldFormState>({
    isValid: undefined,
    submit: async () => ({ isValid: false, data: {} }),
  });

  const { submit } = formState;

  const handleSaveField = useCallback(async () => {
    const { isValid, data } = await submit();

    if (isValid) {
      onSaveField(data as CustomFieldsConfiguration);
    }
  }, [onSaveField, submit]);

  return (
    <EuiFlyout onClose={onCloseFlyout} data-test-subj={dataTestSubj}>
      <EuiFlyoutHeader hasBorder data-test-subj={`${dataTestSubj}-header`}>
        <EuiTitle size="s">
          <h3 id="flyoutTitle">{i18n.ADD_CUSTOM_FIELD}</h3>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <CustomFieldsForm onChange={setFormState} />
      </EuiFlyoutBody>
      <EuiFlyoutFooter data-test-subj={`${dataTestSubj}-footer`}>
        <EuiFlexGroup justifyContent="flexStart">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              onClick={onCloseFlyout}
              data-test-subj={`${dataTestSubj}-cancel`}
              disabled={disabled}
              isLoading={isLoading}
            >
              {i18n.CANCEL}
            </EuiButtonEmpty>
          </EuiFlexItem>

          <EuiFlexGroup justifyContent="flexEnd">
            <EuiFlexItem grow={false}>
              <EuiButton
                fill
                onClick={handleSaveField}
                data-test-subj={`${dataTestSubj}-save`}
                disabled={disabled}
                isLoading={isLoading}
              >
                {i18n.SAVE_FIELD}
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexGroup>
      </EuiFlyoutFooter>
    </EuiFlyout>
  );
};

AddFieldFlyoutComponent.displayName = 'AddFieldFlyout';

export const AddFieldFlyout = React.memo(AddFieldFlyoutComponent);

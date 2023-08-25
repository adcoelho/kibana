/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import { v4 as uuidv4 } from 'uuid';
import { CaseSeverity, CaseStatuses } from '@kbn/cases-plugin/common/types/domain';
import { setTimeout as setTimeoutAsync } from 'timers/promises';

import { SECURITY_SOLUTION_OWNER } from '@kbn/cases-plugin/common';
import { FtrProviderContext } from '../../../../ftr_provider_context';
import {
  createOneCaseBeforeDeleteAllAfter,
  createOneCaseBeforeEachDeleteAllAfterEach,
  createAndNavigateToCase,
} from '../../../../../shared/lib/cases/helpers';

const owner = SECURITY_SOLUTION_OWNER;

export default ({ getPageObject, getService }: FtrProviderContext) => {
  const header = getPageObject('header');
  const testSubjects = getService('testSubjects');
  const cases = getService('cases');
  const find = getService('find');

  const retry = getService('retry');
  const comboBox = getService('comboBox');
  const browser = getService('browser');
  const svlCommonNavigation = getPageObject('svlCommonNavigation');

  describe('View case', () => {
    describe('page', () => {
      createOneCaseBeforeDeleteAllAfter(getPageObject, getService, owner);

      it('should show the case view page correctly', async () => {
        await testSubjects.existOrFail('case-view-title');
        await testSubjects.existOrFail('header-page-supplements');

        await testSubjects.existOrFail('case-view-tab-title-activity');
        await testSubjects.existOrFail('case-view-tab-title-files');
        await testSubjects.existOrFail('description');

        await testSubjects.existOrFail('case-view-activity');

        await testSubjects.existOrFail('case-view-assignees');
        await testSubjects.existOrFail('sidebar-severity');
        await testSubjects.existOrFail('case-view-user-list-reporter');
        await testSubjects.existOrFail('case-view-user-list-participants');
        await testSubjects.existOrFail('case-view-tag-list');
        await testSubjects.existOrFail('cases-categories');
        await testSubjects.existOrFail('sidebar-connectors');
      });
    });

    describe('properties', () => {
      createOneCaseBeforeDeleteAllAfter(getPageObject, getService, owner);

      it('edits a case title from the case view page', async () => {
        const newTitle = `test-${uuidv4()}`;

        await testSubjects.click('editable-title-header-value');
        await testSubjects.setValue('editable-title-input-field', newTitle);
        await testSubjects.click('editable-title-submit-btn');

        // wait for backend response
        await retry.tryForTime(5000, async () => {
          const title = await find.byCssSelector('[data-test-subj="editable-title-header-value"]');
          expect(await title.getVisibleText()).equal(newTitle);
        });

        // validate user action
        await find.byCssSelector('[data-test-subj*="title-update-action"]');
      });

      it('shows error message when title is more than 160 characters', async () => {
        const longTitle = Array(161).fill('x').toString();

        await testSubjects.click('editable-title-header-value');
        await testSubjects.setValue('editable-title-input-field', longTitle);
        await testSubjects.click('editable-title-submit-btn');

        const error = await find.byCssSelector('.euiFormErrorText');
        expect(await error.getVisibleText()).equal(
          'The length of the title is too long. The maximum length is 160 characters.'
        );

        await testSubjects.click('editable-title-cancel-btn');
      });

      it('shows error when description is empty strings, trims the description value on submit', async () => {
        await testSubjects.click('description-edit-icon');

        await header.waitUntilLoadingHasFinished();

        const editCommentTextArea = await find.byCssSelector(
          '[data-test-subj*="editable-markdown-form"] textarea.euiMarkdownEditorTextArea'
        );

        await header.waitUntilLoadingHasFinished();

        await editCommentTextArea.focus();
        await editCommentTextArea.clearValue();
        await editCommentTextArea.type('   ');

        const error = await find.byCssSelector('.euiFormErrorText');
        expect(await error.getVisibleText()).equal('A description is required.');

        await editCommentTextArea.type('Description with space     ');

        await testSubjects.click('editable-save-markdown');
        await header.waitUntilLoadingHasFinished();

        const desc = await find.byCssSelector(
          '[data-test-subj="description"] [data-test-subj="scrollable-markdown"]'
        );

        expect(await desc.getVisibleText()).equal('Description with space');
      });

      it('adds a comment to a case', async () => {
        const commentArea = await find.byCssSelector(
          '[data-test-subj="add-comment"] textarea.euiMarkdownEditorTextArea'
        );
        await commentArea.focus();
        await commentArea.type('Test comment from automation');

        await testSubjects.click('submit-comment');

        // validate user action
        const newComment = await find.byCssSelector(
          '[data-test-subj*="comment-create-action"] [data-test-subj="scrollable-markdown"]'
        );
        expect(await newComment.getVisibleText()).equal('Test comment from automation');
      });

      it('adds a category to a case', async () => {
        const category = uuidv4();
        await testSubjects.click('category-edit-button');
        await comboBox.setCustom('comboBoxInput', category);
        await testSubjects.click('edit-category-submit');

        // validate category was added
        await testSubjects.existOrFail('category-viewer-' + category);

        // validate user action
        await find.byCssSelector('[data-test-subj*="category-update-action"]');
      });

      it('deletes a category from a case', async () => {
        await find.byCssSelector('[data-test-subj*="category-viewer-"]');

        await testSubjects.click('category-remove-button');

        await testSubjects.existOrFail('no-categories');
        // validate user action
        await find.byCssSelector('[data-test-subj*="category-delete-action"]');
      });

      it('shows error when category is more than 50 characters', async () => {
        const longCategory = Array(51).fill('x').toString();
        await testSubjects.click('category-edit-button');
        await comboBox.setCustom('comboBoxInput', longCategory);
        await testSubjects.click('edit-category-submit');

        const error = await find.byCssSelector('.euiFormErrorText');
        expect(await error.getVisibleText()).equal(
          'The length of the category is too long. The maximum length is 50 characters.'
        );

        await testSubjects.click('edit-category-cancel');
      });

      it('adds a tag to a case', async () => {
        const tag = uuidv4();
        await testSubjects.click('tag-list-edit-button');
        await comboBox.setCustom('comboBoxInput', tag);
        await testSubjects.click('edit-tags-submit');

        // validate tag was added
        await testSubjects.existOrFail('tag-' + tag);

        // validate user action
        await find.byCssSelector('[data-test-subj*="tags-add-action"]');
      });

      it('shows error when tag is more than 256 characters', async () => {
        const longTag = Array(257).fill('a').toString();

        await testSubjects.click('tag-list-edit-button');
        await comboBox.clearInputField('comboBoxInput');

        await header.waitUntilLoadingHasFinished();

        await comboBox.setCustom('comboBoxInput', longTag);
        await browser.pressKeys(browser.keys.ENTER);

        const error = await find.byCssSelector('.euiFormErrorText');
        expect(await error.getVisibleText()).equal(
          'The length of the tag is too long. The maximum length is 256 characters.'
        );

        await comboBox.clearInputField('comboBoxInput');

        await testSubjects.click('edit-tags-cancel');
      });

      it('deletes a tag from a case', async () => {
        await testSubjects.click('tag-list-edit-button');
        // find the tag button and click the close button
        const button = await find.byCssSelector('[data-test-subj="comboBoxInput"] button');
        await button.click();
        await testSubjects.click('edit-tags-submit');

        // validate user action
        await find.byCssSelector('[data-test-subj*="tags-delete-action"]');
      });

      it('shows error when more than 200 tags are added to the case', async () => {
        const tags = Array(200).fill('foo');

        await cases.common.addMultipleTags(tags);
        await testSubjects.click('edit-tags-submit');

        const error = await find.byCssSelector('.euiFormErrorText');
        expect(await error.getVisibleText()).equal(
          'Too many tags. The maximum number of allowed tags is 200'
        );

        await testSubjects.click('edit-tags-cancel');
      });

      describe('status', () => {
        it('changes a case status to in-progress via dropdown menu', async () => {
          await cases.common.changeCaseStatusViaDropdownAndVerify(CaseStatuses['in-progress']);
          // validate user action
          await find.byCssSelector(
            '[data-test-subj*="status-update-action"] [data-test-subj="case-status-badge-in-progress"]'
          );
          // validates dropdown tag
          await testSubjects.existOrFail(
            'case-view-status-dropdown > case-status-badge-popover-button-in-progress'
          );
        });

        it('changes a case status to closed via dropdown-menu', async () => {
          await cases.common.changeCaseStatusViaDropdownAndVerify(CaseStatuses.closed);

          // validate user action
          await find.byCssSelector(
            '[data-test-subj*="status-update-action"] [data-test-subj="case-status-badge-closed"]'
          );
          // validates dropdown tag
          await testSubjects.existOrFail(
            'case-view-status-dropdown > case-status-badge-popover-button-closed'
          );
        });

        it("reopens a case from the 'reopen case' button", async () => {
          await cases.common.changeCaseStatusViaDropdownAndVerify(CaseStatuses.closed);
          await header.waitUntilLoadingHasFinished();
          await testSubjects.click('case-view-status-action-button');
          await header.waitUntilLoadingHasFinished();

          await testSubjects.existOrFail(
            'header-page-supplements > case-status-badge-popover-button-open',
            {
              timeout: 5000,
            }
          );

          // validate user action
          await find.byCssSelector(
            '[data-test-subj*="status-update-action"] [data-test-subj="case-status-badge-open"]'
          );
          // validates dropdown tag
          await testSubjects.existOrFail(
            'case-view-status-dropdown > case-status-badge-popover-button-open'
          );
        });

        it("marks in progress a case from the 'mark in progress' button", async () => {
          await cases.common.changeCaseStatusViaDropdownAndVerify(CaseStatuses.open);
          await header.waitUntilLoadingHasFinished();
          await testSubjects.click('case-view-status-action-button');
          await header.waitUntilLoadingHasFinished();

          await testSubjects.existOrFail(
            'header-page-supplements > case-status-badge-popover-button-in-progress',
            {
              timeout: 5000,
            }
          );

          // validate user action
          await find.byCssSelector(
            '[data-test-subj*="status-update-action"] [data-test-subj="case-status-badge-in-progress"]'
          );
          // validates dropdown tag
          await testSubjects.existOrFail(
            'case-view-status-dropdown > case-status-badge-popover-button-in-progress'
          );
        });

        it("closes a case from the 'close case' button", async () => {
          await cases.common.changeCaseStatusViaDropdownAndVerify(CaseStatuses['in-progress']);
          await header.waitUntilLoadingHasFinished();
          await testSubjects.click('case-view-status-action-button');
          await header.waitUntilLoadingHasFinished();

          await testSubjects.existOrFail(
            'header-page-supplements > case-status-badge-popover-button-closed',
            {
              timeout: 5000,
            }
          );

          // validate user action
          await find.byCssSelector(
            '[data-test-subj*="status-update-action"] [data-test-subj="case-status-badge-closed"]'
          );
          // validates dropdown tag
          await testSubjects.existOrFail(
            'case-view-status-dropdown >case-status-badge-popover-button-closed'
          );
        });
      });

      describe('Severity field', () => {
        createOneCaseBeforeDeleteAllAfter(getPageObject, getService, owner);

        it('shows the severity field on the sidebar', async () => {
          await testSubjects.existOrFail('case-severity-selection');
        });

        it('changes the severity level from the selector', async () => {
          await cases.common.selectSeverity(CaseSeverity.MEDIUM);
          await header.waitUntilLoadingHasFinished();
          await testSubjects.existOrFail('case-severity-selection-' + CaseSeverity.MEDIUM);

          // validate user action
          await find.byCssSelector('[data-test-subj*="severity-update-action"]');
        });
      });
    });

    describe('draft comments', () => {
      createOneCaseBeforeEachDeleteAllAfterEach(getPageObject, getService, owner);

      it('persists new comment when status is updated in dropdown', async () => {
        const commentArea = await find.byCssSelector(
          '[data-test-subj="add-comment"] textarea.euiMarkdownEditorTextArea'
        );
        await commentArea.focus();
        await commentArea.type('Test comment from automation');

        await cases.common.changeCaseStatusViaDropdownAndVerify(CaseStatuses['in-progress']);
        // validate user action
        await find.byCssSelector(
          '[data-test-subj*="status-update-action"] [data-test-subj="case-status-badge-in-progress"]'
        );
        // validates dropdown tag
        await testSubjects.existOrFail(
          'case-view-status-dropdown > case-status-badge-popover-button-in-progress'
        );

        await testSubjects.click('submit-comment');

        // validate user action
        const newComment = await find.byCssSelector(
          '[data-test-subj*="comment-create-action"] [data-test-subj="scrollable-markdown"]'
        );
        expect(await newComment.getVisibleText()).equal('Test comment from automation');
      });

      it('persists new comment when case is closed through the close case button', async () => {
        const commentArea = await find.byCssSelector(
          '[data-test-subj="add-comment"] textarea.euiMarkdownEditorTextArea'
        );
        await commentArea.focus();
        await commentArea.type('Test comment from automation');

        await cases.common.changeCaseStatusViaDropdownAndVerify(CaseStatuses['in-progress']);
        await header.waitUntilLoadingHasFinished();
        await testSubjects.click('case-view-status-action-button');
        await header.waitUntilLoadingHasFinished();

        await testSubjects.existOrFail(
          'header-page-supplements > case-status-badge-popover-button-closed',
          {
            timeout: 5000,
          }
        );

        // validate user action
        await find.byCssSelector(
          '[data-test-subj*="status-update-action"] [data-test-subj="case-status-badge-closed"]'
        );
        // validates dropdown tag
        await testSubjects.existOrFail(
          'case-view-status-dropdown >case-status-badge-popover-button-closed'
        );

        await testSubjects.click('submit-comment');

        // validate user action
        const newComment = await find.byCssSelector(
          '[data-test-subj*="comment-create-action"] [data-test-subj="scrollable-markdown"]'
        );
        expect(await newComment.getVisibleText()).equal('Test comment from automation');
      });

      it('persists new comment to the case when user goes to case list table and comes back to the case', async () => {
        const comment = 'Test comment from automation';

        let commentArea = await find.byCssSelector(
          '[data-test-subj="add-comment"] textarea.euiMarkdownEditorTextArea'
        );
        await commentArea.focus();
        await commentArea.type(comment);

        /**
         * We need to wait for some time to
         * give the localStorage a change to persist
         * the comment. Otherwise, the test navigates to
         * fast to the cases table and the comment is not
         * persisted
         */
        await setTimeoutAsync(2000);

        await testSubjects.click('backToCases');

        await cases.casesTable.waitForCasesToBeListed();
        await cases.casesTable.goToFirstListedCase();
        await header.waitUntilLoadingHasFinished();

        commentArea = await find.byCssSelector(
          '[data-test-subj="add-comment"] textarea.euiMarkdownEditorTextArea'
        );

        expect(await commentArea.getVisibleText()).equal(comment);

        await testSubjects.click('submit-comment');

        // validate user action
        const newComment = await find.byCssSelector(
          '[data-test-subj*="comment-create-action"] [data-test-subj="scrollable-markdown"]'
        );

        expect(await newComment.getVisibleText()).equal(comment);
      });

      it('shows unsaved comment message when page is refreshed', async () => {
        await cases.singleCase.addComment('my comment');
        await header.waitUntilLoadingHasFinished();

        await testSubjects.click('property-actions-user-action-ellipses');
        await header.waitUntilLoadingHasFinished();
        await testSubjects.click('property-actions-user-action-pencil');
        await header.waitUntilLoadingHasFinished();

        const editCommentTextArea = await find.byCssSelector(
          '[data-test-subj*="editable-markdown-form"] textarea.euiMarkdownEditorTextArea'
        );

        await header.waitUntilLoadingHasFinished();

        await editCommentTextArea.focus();
        await editCommentTextArea.type('Edited comment');

        /**
         * We need to wait for some time to
         * give the localStorage a change to persist
         * the comment. Otherwise, the test navigates to
         * fast to the cases table and the comment is not
         * persisted
         */
        await setTimeoutAsync(2000);

        await header.waitUntilLoadingHasFinished();
        await browser.refresh();

        await header.waitUntilLoadingHasFinished();

        await testSubjects.existOrFail('user-action-comment-unsaved-draft');
      });

      it('shows unsaved description message when page is refreshed', async () => {
        await testSubjects.click('description-edit-icon');

        await header.waitUntilLoadingHasFinished();

        const editCommentTextArea = await find.byCssSelector(
          '[data-test-subj*="editable-markdown-form"] textarea.euiMarkdownEditorTextArea'
        );

        await header.waitUntilLoadingHasFinished();

        await editCommentTextArea.focus();
        await editCommentTextArea.type('Edited description');

        /**
         * We need to wait for some time to
         * give the localStorage a change to persist
         * the comment. Otherwise, the test navigates to
         * fast to the cases table and the comment is not
         * persisted
         */
        await setTimeoutAsync(2000);

        await header.waitUntilLoadingHasFinished();

        await browser.refresh();

        await header.waitUntilLoadingHasFinished();

        await testSubjects.existOrFail('description-unsaved-draft');
      });

      it('should persist the draft of new comment while old comment is updated', async () => {
        await cases.singleCase.addComment('my first comment');

        let commentArea = await find.byCssSelector(
          '[data-test-subj="add-comment"] textarea.euiMarkdownEditorTextArea'
        );

        await commentArea.focus();
        await commentArea.clearValue();
        await commentArea.type('Test comment from automation');

        await testSubjects.click('property-actions-user-action-ellipses');
        await header.waitUntilLoadingHasFinished();
        await testSubjects.click('property-actions-user-action-pencil');
        await header.waitUntilLoadingHasFinished();

        const editCommentTextArea = await find.byCssSelector(
          '[data-test-subj*="editable-markdown-form"] textarea.euiMarkdownEditorTextArea'
        );

        await header.waitUntilLoadingHasFinished();

        await editCommentTextArea.focus();
        await editCommentTextArea.type('Edited comment');

        await testSubjects.click('editable-save-markdown');
        await header.waitUntilLoadingHasFinished();

        /**
         * We need to wait for some time to
         * give the localStorage a change to persist
         * the comment. Otherwise, the test navigates to
         * fast to the cases table and the comment is not
         * persisted
         */
        await setTimeoutAsync(2000);

        await header.waitUntilLoadingHasFinished();

        await browser.refresh();

        await header.waitUntilLoadingHasFinished();

        commentArea = await find.byCssSelector(
          '[data-test-subj="add-comment"] textarea.euiMarkdownEditorTextArea'
        );

        expect(await commentArea.getVisibleText()).to.be('Test comment from automation');
      });

      /**
       * There is this bug https://github.com/elastic/kibana/issues/157280
       * where this test randomly reproduces thus making the test flaky.
       * Skipping for now until we fix it.
       */
      it.skip('should persist the draft of new comment while description is updated', async () => {
        let commentArea = await find.byCssSelector(
          '[data-test-subj="add-comment"] textarea.euiMarkdownEditorTextArea'
        );

        await commentArea.focus();
        await commentArea.type('Test comment from automation');

        await testSubjects.click('description-edit-icon');

        await header.waitUntilLoadingHasFinished();

        const description = await find.byCssSelector(
          '[data-test-subj*="editable-markdown-form"] textarea.euiMarkdownEditorTextArea'
        );

        await header.waitUntilLoadingHasFinished();

        await description.focus();
        await description.type('Edited description');

        await testSubjects.click('editable-save-markdown');
        await header.waitUntilLoadingHasFinished();

        await browser.refresh();
        await header.waitUntilLoadingHasFinished();

        commentArea = await find.byCssSelector(
          '[data-test-subj="add-comment"] textarea.euiMarkdownEditorTextArea'
        );

        expect(await commentArea.getVisibleText()).to.be('Test comment from automation');
      });
    });

    describe('actions', () => {
      createOneCaseBeforeDeleteAllAfter(getPageObject, getService, owner);

      it('deletes the case successfully', async () => {
        await cases.singleCase.deleteCase();
        await cases.casesTable.waitForTableToFinishLoading();
        await cases.casesTable.validateCasesTableHasNthRows(0);
      });
    });

    describe('filter activity', () => {
      createOneCaseBeforeDeleteAllAfter(getPageObject, getService, owner);

      it('filters by all by default', async () => {
        const allBadge = await find.byCssSelector(
          '[data-test-subj="user-actions-filter-activity-button-all"] span.euiNotificationBadge'
        );

        expect(await allBadge.getAttribute('aria-label')).equal('1 active filters');
      });

      it('filters by comment successfully', async () => {
        const commentBadge = await find.byCssSelector(
          '[data-test-subj="user-actions-filter-activity-button-comments"] span.euiNotificationBadge'
        );

        expect(await commentBadge.getAttribute('aria-label')).equal('0 available filters');

        const commentArea = await find.byCssSelector(
          '[data-test-subj="add-comment"] textarea.euiMarkdownEditorTextArea'
        );
        await commentArea.focus();
        await commentArea.type('Test comment from automation');
        await testSubjects.click('submit-comment');

        await header.waitUntilLoadingHasFinished();

        await testSubjects.click('user-actions-filter-activity-button-comments');

        expect(await commentBadge.getAttribute('aria-label')).equal('1 active filters');
      });

      it('filters by history successfully', async () => {
        const historyBadge = await find.byCssSelector(
          '[data-test-subj="user-actions-filter-activity-button-history"] span.euiNotificationBadge'
        );

        expect(await historyBadge.getAttribute('aria-label')).equal('1 available filters');

        await cases.common.selectSeverity(CaseSeverity.MEDIUM);

        await cases.common.changeCaseStatusViaDropdownAndVerify(CaseStatuses['in-progress']);

        await header.waitUntilLoadingHasFinished();

        await testSubjects.click('user-actions-filter-activity-button-history');

        expect(await historyBadge.getAttribute('aria-label')).equal('3 active filters');
      });

      it('sorts by newest first successfully', async () => {
        await testSubjects.click('user-actions-filter-activity-button-all');

        const AllBadge = await find.byCssSelector(
          '[data-test-subj="user-actions-filter-activity-button-all"] span.euiNotificationBadge'
        );

        expect(await AllBadge.getVisibleText()).equal('4');

        const sortDesc = await find.byCssSelector(
          '[data-test-subj="user-actions-sort-select"] [value="desc"]'
        );

        await sortDesc.click();

        await header.waitUntilLoadingHasFinished();

        const userActionsLists = await find.allByCssSelector(
          '[data-test-subj="user-actions-list"]'
        );

        const actionList = await userActionsLists[0].findAllByClassName('euiComment');

        expect(await actionList[0].getAttribute('data-test-subj')).contain('status-update-action');
      });
    });

    // TO FIX - https://github.com/elastic/kibana/issues/164736
    describe.skip('Lens visualization', () => {
      before(async () => {
        await cases.testResources.installKibanaSampleData('logs');
        await createAndNavigateToCase(getPageObject, getService, owner);
      });

      after(async () => {
        await cases.testResources.removeKibanaSampleData('logs');
        await cases.api.deleteAllCases();
      });

      it('adds lens visualization in description', async () => {
        await testSubjects.click('description-edit-icon');

        await header.waitUntilLoadingHasFinished();

        const editCommentTextArea = await find.byCssSelector(
          '[data-test-subj*="editable-markdown-form"] textarea.euiMarkdownEditorTextArea'
        );

        await header.waitUntilLoadingHasFinished();

        await editCommentTextArea.focus();

        const editableDescription = await testSubjects.find('editable-markdown-form');

        const addVisualizationButton = await editableDescription.findByCssSelector(
          '[data-test-subj="euiMarkdownEditorToolbarButton"][aria-label="Visualization"]'
        );
        await addVisualizationButton.click();

        await cases.singleCase.findAndSaveVisualization('[Logs] Bytes distribution');

        await header.waitUntilLoadingHasFinished();

        await testSubjects.click('editable-save-markdown');

        await header.waitUntilLoadingHasFinished();

        const description = await find.byCssSelector('[data-test-subj="description"]');

        await description.findByCssSelector('[data-test-subj="xyVisChart"]');
      });

      it('adds lens visualization in existing comment', async () => {
        const commentArea = await find.byCssSelector(
          '[data-test-subj="add-comment"] textarea.euiMarkdownEditorTextArea'
        );
        await commentArea.focus();
        await commentArea.type('Test comment from automation');

        await header.waitUntilLoadingHasFinished();

        await testSubjects.click('submit-comment');

        await header.waitUntilLoadingHasFinished();

        await testSubjects.click('property-actions-user-action-ellipses');

        await header.waitUntilLoadingHasFinished();

        await testSubjects.click('property-actions-user-action-pencil');

        await header.waitUntilLoadingHasFinished();

        const editComment = await find.byCssSelector('[data-test-subj*="editable-markdown-form"]');

        const addVisualizationButton = await editComment.findByCssSelector(
          '[data-test-subj="euiMarkdownEditorToolbarButton"][aria-label="Visualization"]'
        );
        await addVisualizationButton.click();

        await cases.singleCase.findAndSaveVisualization('[Logs] Bytes distribution');

        await header.waitUntilLoadingHasFinished();

        await testSubjects.click('editable-save-markdown');

        await header.waitUntilLoadingHasFinished();

        const createdComment = await find.byCssSelector(
          '[data-test-subj*="comment-create-action"] [data-test-subj="scrollable-markdown"]'
        );

        await createdComment.findByCssSelector('[data-test-subj="xyVisChart"]');
      });

      it('adds lens visualization in new comment', async () => {
        await cases.singleCase.addVisualizationToNewComment('[Logs] Bytes distribution');

        await header.waitUntilLoadingHasFinished();

        const newComment = await find.byCssSelector('[data-test-subj*="comment-create-action"]');

        await newComment.findByCssSelector('[data-test-subj="xyVisChart"]');
      });
    });

    describe('pagination', async () => {
      let createdCase: any;

      before(async () => {
        createdCase = await createAndNavigateToCase(getPageObject, getService, owner);
      });

      after(async () => {
        await cases.api.deleteAllCases();
      });

      it('initially renders user actions list correctly', async () => {
        expect(testSubjects.missingOrFail('cases-show-more-user-actions'));

        const userActionsLists = await find.allByCssSelector(
          '[data-test-subj="user-actions-list"]'
        );

        expect(userActionsLists).length(1);
      });

      it('shows more actions on button click', async () => {
        await cases.api.generateUserActions({
          caseId: createdCase.id,
          caseVersion: createdCase.version,
          totalUpdates: 4,
        });

        expect(testSubjects.missingOrFail('user-actions-loading'));

        await header.waitUntilLoadingHasFinished();

        await testSubjects.click('case-refresh');

        await header.waitUntilLoadingHasFinished();

        expect(testSubjects.existOrFail('cases-show-more-user-actions'));

        const userActionsLists = await find.allByCssSelector(
          '[data-test-subj="user-actions-list"]'
        );

        expect(userActionsLists).length(2);

        expect(await userActionsLists[0].findAllByClassName('euiComment')).length(10);

        expect(await userActionsLists[1].findAllByClassName('euiComment')).length(4);

        testSubjects.click('cases-show-more-user-actions');

        await header.waitUntilLoadingHasFinished();

        expect(await userActionsLists[0].findAllByClassName('euiComment')).length(20);

        expect(await userActionsLists[1].findAllByClassName('euiComment')).length(4);
      });
    });

    describe('Tabs', () => {
      createOneCaseBeforeDeleteAllAfter(getPageObject, getService, owner);

      it('shows the "activity" tab by default', async () => {
        await testSubjects.existOrFail('case-view-tab-title-activity');
        await testSubjects.existOrFail('case-view-tab-content-activity');
      });

      // there are no alerts in stack management yet
      it.skip("shows the 'alerts' tab when clicked", async () => {
        await testSubjects.click('case-view-tab-title-alerts');
        await testSubjects.existOrFail('case-view-tab-content-alerts');
      });

      it("shows the 'files' tab when clicked", async () => {
        await testSubjects.click('case-view-tab-title-files');
        await testSubjects.existOrFail('case-view-tab-content-files');
      });
    });

    describe('Files', () => {
      createOneCaseBeforeDeleteAllAfter(getPageObject, getService, owner);

      it('adds a file to the case', async () => {
        // navigate to files tab
        await testSubjects.click('case-view-tab-title-files');
        await testSubjects.existOrFail('case-view-tab-content-files');

        await cases.casesFilesTable.addFile(
          require.resolve('../../../../../shared/lib/assets/elastic_logo.png')
        );

        // make sure the uploaded file is displayed on the table
        await find.byButtonText('elastic_logo.png');
      });

      it('search by file name', async () => {
        await cases.casesFilesTable.searchByFileName('foobar');

        await cases.casesFilesTable.emptyOrFail();

        await cases.casesFilesTable.searchByFileName('elastic');

        await find.byButtonText('elastic_logo.png');
      });

      it('displays the file preview correctly', async () => {
        await cases.casesFilesTable.openFilePreview(0);

        await testSubjects.existOrFail('cases-files-image-preview');
      });

      it('pressing escape key closes the file preview', async () => {
        await testSubjects.existOrFail('cases-files-image-preview');

        await browser.pressKeys(browser.keys.ESCAPE);

        await testSubjects.missingOrFail('cases-files-image-preview');
      });

      it('files added to a case can be deleted', async () => {
        await cases.casesFilesTable.deleteFile(0);

        await cases.casesFilesTable.emptyOrFail();
      });

      describe('Files User Activity', () => {
        it('file user action is displayed correctly', async () => {
          await cases.casesFilesTable.addFile(
            require.resolve('../../../../../shared/lib/assets/elastic_logo.png')
          );

          await testSubjects.click('case-view-tab-title-activity');
          await testSubjects.existOrFail('case-view-tab-content-activity');

          await find.byButtonText('elastic_logo.png');
        });
      });
    });

    describe('breadcrumbs', () => {
      let createdCase: any;

      before(async () => {
        createdCase = await createAndNavigateToCase(getPageObject, getService, owner);
      });

      after(async () => {
        await cases.api.deleteAllCases();
      });

      it('should set the cases title', async () => {
        svlCommonNavigation.breadcrumbs.expectExists();
        svlCommonNavigation.breadcrumbs.expectBreadcrumbExists({ text: createdCase.title });
      });
    });

    describe('reporter', () => {
      createOneCaseBeforeDeleteAllAfter(getPageObject, getService, owner);

      it('should render the reporter correctly', async () => {
        const reporter = await cases.singleCase.getReporter();

        const reporterText = await reporter.getVisibleText();

        expect(reporterText).to.be('elastic');
      });
    });
  });
};

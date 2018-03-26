import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { User } from '../../../model';
import { BulkActions, BulkActionTypes } from '../actions';
import { BulkUploadFileInfo, Question } from '../../../model';

// for get all BulkUploadFileInfo
export function bulkUploadFileInfos(state: any = [], action: BulkActions): BulkUploadFileInfo[] {
    switch (action.type) {
        case BulkActionTypes.LOAD_BULK_UPLOAD_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

// for get BulkUploadFileInfo by User
export function userBulkUploadFileInfos(state: any = [], action: BulkActions): BulkUploadFileInfo[] {
    switch (action.type) {
        case BulkActionTypes.LOAD_USER_BULK_UPLOAD_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

// for file PublishedQuestions by BulkUpload Id
export function bulkUploadPublishedQuestions(state: any = [], action: BulkActions): Question[] {
    switch (action.type) {
        case BulkActionTypes.LOAD_BULK_UPLOAD_PUBLISHED_QUESTIONS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};


// file UnpublishedQuestions by BulkUpload Id
export function bulkUploadUnpublishedQuestions(state: any = [], action: BulkActions): Question[] {
    switch (action.type) {
        case BulkActionTypes.LOAD_BULK_UPLOAD_UNPUBLISHED_QUESTIONS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
};

// question save Status
export function questionSaveStatus(state: any = 'NONE', action: BulkActions): string {
    switch (action.type) {
        case BulkActionTypes.UPDATE_QUESTION:
            return 'UPDATE';
        default:
            return null;
    }
};

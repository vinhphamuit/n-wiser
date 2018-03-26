import { Routes, RouterModule } from '@angular/router';
import { BulkDetailsComponent, BulkUploadComponent,BulkSummaryComponent } from '../components/index';

<<<<<<< HEAD
import { AuthGuard } from '../../core/services';
=======
import { AuthGuard } from '../../core/route-guards';
>>>>>>> upstream/master

export const bulkRoutes: Routes = [
  {
    path: '',
    component: BulkSummaryComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'upload',
    component: BulkUploadComponent,
    canActivate: [AuthGuard]
  }
];

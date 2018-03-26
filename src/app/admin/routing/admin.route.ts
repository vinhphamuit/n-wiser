import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, CategoriesComponent, TagsComponent,
         AdminQuestionsComponent, AdminComponent, BulkComponent } from '../components/index';
<<<<<<< HEAD
import { AuthGuard } from '../../core/services';
=======
import { AuthGuard } from '../../core/route-guards';
>>>>>>> upstream/master

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DashboardComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },
      {
        path: 'tags',
        component: TagsComponent
      },
      {
        path: 'questions',
        component: AdminQuestionsComponent
      },
      {
        path: 'bulk',
        component: BulkComponent
      }
    ]
  }
];

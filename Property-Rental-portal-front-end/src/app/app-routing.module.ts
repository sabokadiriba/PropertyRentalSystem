import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { authGuard } from './shared/auth.guard';
import { claimReq} from './shared/utils/ClaimReq-utils'

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate:[authGuard],
    canActivateChild:[authGuard],
    children: [
      {
        path: '',
       
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
     
      {
        path: 'add-property',
        data: { claimReq: claimReq.ownerOnly },
        loadComponent: () => import('./demo/add-property/add-property.component').then((c)=> c.AddPropertyComponent)
      },
      {
        path: 'view-property',
        data: { claimReq: claimReq.ownerOnly },
        loadComponent: () => import('./demo/view-property/view-property.component').then((c) => c.ViewPropertyComponent)
      },
      {
        path: 'update-property/:id',
        data: { claimReq: claimReq.ownerOnly },
        loadComponent: () =>
          import('./demo/update-property/update-property.component').then(
            (c) => c.UpdatePropertyComponent
          )
      },
      {
        path: 'rent-request',
        data: { claimReq: claimReq.seekerOnly },
        loadComponent: () =>
          import('./demo/rent-request/rent-request.component').then(
            (c) => c.RentRequestComponent
          )
      },
      {
        path: 'view-rent-request',
        data: { claimReq: claimReq.seekerOnly },
        loadComponent: () =>
          import('./demo/view-rent-request/view-rent-request.component').then(
            (c) => c.ViewRentRequestComponent
          )
      },
      {
        path: 'forbidden',
        loadComponent: () =>
          import('./shared/forbidden/forbidden.component').then(
            (c) => c.ForbiddenComponent
          )
      }
      
      
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

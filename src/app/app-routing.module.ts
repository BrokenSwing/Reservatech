import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  {path: 'events', loadChildren: () => import('./events/events.module').then(m => m.EventsModule)},
  {path: 'organizations', loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

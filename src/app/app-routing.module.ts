import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate:[AuthGuard] },
  { path: 'login', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: '', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule',canActivate:[AuthGuard] },
  { path: 'stats', loadChildren: './pages/stats/stats.module#StatsPageModule',canActivate:[AuthGuard] },
  { path: 'events', loadChildren: './pages/events/events.module#EventsPageModule',canActivate:[AuthGuard] },
  { path: 'messages', loadChildren: './pages/messages/messages.module#MessagesPageModule',canActivate:[AuthGuard] },




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

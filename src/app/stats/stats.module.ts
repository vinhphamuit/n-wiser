import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared.module';
import { LeaderboardComponent, RealtimeStatsComponent } from './components';
import { effects, reducer } from './store';

@NgModule({
  declarations: [
    LeaderboardComponent,
    RealtimeStatsComponent
  ],
  imports: [
    // n modules
    SharedModule,
    // ngrx feature store
    StoreModule.forFeature('stats', reducer),
    // ngrx effects
    EffectsModule.forFeature(effects),
  ],
  providers: [
  ],
  exports: [
    LeaderboardComponent,
    RealtimeStatsComponent
  ]
})
export class StatsModule { }

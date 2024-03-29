import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { BlogComponent, NewsletterComponent } from './components';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { effects, reducer } from './store';

@NgModule({
  declarations: [
    BlogComponent,
    NewsletterComponent
  ],
  imports: [
    // n modules
    SharedModule,
    // ngrx feature store
    StoreModule.forFeature('social', reducer),

    // ngrx effects
    EffectsModule.forFeature(effects),
  ],
  providers: [
  ],
  exports: [
    BlogComponent,
    NewsletterComponent
  ]
})
export class SocialModule { }

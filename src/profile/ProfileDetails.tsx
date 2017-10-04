import * as m from 'mithril';

import { IndicatorList } from '../indicator';
import { Profile } from './index';

export const ProfileDetails: FnComponent<{ profile: Profile }> = () => ({
  view: ({ attrs: { profile } }) =>
    <div class="container">
      <h2>{profile.name}</h2>
      {m(IndicatorList, { indicators: profile.indicators })}
    </div>
});

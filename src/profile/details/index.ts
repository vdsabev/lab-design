import { div, h2 } from 'compote/html';
import * as m from 'mithril';

import { Profile } from '../index';
import { IndicatorList } from '../../indicator';

interface Attrs extends Partial<HTMLDivElement> {
  profile: Profile;
}

export const ProfileDetails: m.Component<Attrs, null> = {
  view: ({ attrs: { profile } }) => (
    div({ class: 'container' }, [
      h2(profile.name),
      m(IndicatorList, {
        indicators: Object.keys(profile.indicators).reduce((indicators, indicatorId) => ({
          ...indicators,
          [indicatorId]: profile.indicators[indicatorId].value
        }), {})
      })
    ])
  )
};

import { div, h2 } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import { Component } from 'mithril';

import { UserProfile as UserProfileType } from '../user';

interface Attrs extends Partial<HTMLDivElement> {
  profile: UserProfileType;
}

export const UserProfile: Component<Attrs, null> = {
  view: ({ attrs: { profile } }) => (
    div({ class: 'container' }, [
      h2(profile.name),
      Object.keys(profile.indicators).map((indicatorId) => [
        div(`${indicatorId}: ${profile.indicators[indicatorId].value}`),
        Timeago(new Date(<number>profile.indicators[indicatorId].date))
      ])
    ])
  )
};

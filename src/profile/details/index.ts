import { div, h2 } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import { Component } from 'mithril';

import { Profile } from '../index';
import { toArray } from '../../utils';

interface Attrs extends Partial<HTMLDivElement> {
  profile: Profile;
}

export const ProfileDetails: Component<Attrs, null> = {
  view: ({ attrs: { profile } }) => (
    div({ class: 'container' }, [
      h2(profile.name),
      toArray(profile.indicators).map((indicator) => [
        div(`${indicator.id}: ${indicator.value}`),
        Timeago(new Date(<number>indicator.date))
      ])
    ])
  )
};

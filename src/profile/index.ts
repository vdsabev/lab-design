import { div, h2 } from 'compote/html';
import { Timeago } from 'compote/components/timeago';
import { Component } from 'mithril';

import * as Services from './services';
export const ProfileServices = Services;

import { toArray } from '../utils';

export interface Profile {
  id: string;
  name: string;
  imageUrl: string;
  gender: 'male' | 'female' | 'other';
  birthdate: number | Object;
  indicators: Record<string, ProfileIndicator>;
}

interface ProfileIndicator {
  id: string;
  date: number | Object;
  value: number;
}

interface Attrs extends Partial<HTMLDivElement> {
  profile: Profile;
}

export const ProfilePage: Component<Attrs, null> = {
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

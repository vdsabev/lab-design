import { Keyboard } from 'compote/components/keyboard';
import { constant, get, set, when, equal } from 'compote/components/utils';
import { redraw, withAttr } from 'mithril';

import { AuthServices } from '../auth';
import { route, Routes } from '../router';

interface Attrs {
  email?: string;
  password?: string;
  loading?: boolean;
}

// TODO: Use form data
// TODO: Add validation
export const Login: FnComponent<Attrs> = () => {
  const state: Attrs = {};

  const setEmail = withAttr('value', set<Attrs>('email')(state));
  const setPassword = withAttr('value', set<Attrs>('password')(state));

  const login = async () => {
    try {
      state.loading = true;
      await AuthServices.login(state.email, state.password);
      route.set(Routes.HOME);
    }
    catch (error) {
      state.loading = false;
      redraw();
    }
  };

  const loginOnEnter = when(equal(get<KeyboardEvent>('keyCode'), Keyboard.ENTER), login);

  return {
    view: () => (
      <div class="container fade-in-animation">
        <form class="form" onsubmit={returnFalse}>
          <fieldset class="form-panel" disabled={state.loading === true}>
            <input
              class="form-input"
              type="email" name="email" placeholder="Имейл" required autofocus
              onkeyup={loginOnEnter} oninput={setEmail}
            />
            <br />
            <input
              class="form-input"
              type="password" name="password" placeholder="Парола" required
              onkeyup={loginOnEnter} oninput={setPassword}
            />
            <br />
            <button class="form-button" type="submit" onclick={login}>Вход</button>
          </fieldset>
        </form>
      </div>
    )
  };
};

const returnFalse = constant(false);

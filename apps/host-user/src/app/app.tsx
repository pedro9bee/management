import * as React from 'react';

import NxWelcome from './nx-welcome';

import { Link, Route, Routes } from 'react-router-dom';

const RemoteUserLogin = React.lazy(() => import('remote-user-login/Module'));

const RemoteUserRegister = React.lazy(
  () => import('remote-user-register/Module')
);

const RemoteUserPasswordReset = React.lazy(
  () => import('remote-user-password-reset/Module')
);

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/remote-user-login">RemoteUserLogin</Link>
        </li>

        <li>
          <Link to="/remote-user-register">RemoteUserRegister</Link>
        </li>

        <li>
          <Link to="/remote-user-password-reset">RemoteUserPasswordReset</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="host-user" />} />

        <Route path="/remote-user-login" element={<RemoteUserLogin />} />

        <Route path="/remote-user-register" element={<RemoteUserRegister />} />

        <Route
          path="/remote-user-password-reset"
          element={<RemoteUserPasswordReset />}
        />
      </Routes>
    </React.Suspense>
  );
}

export default App;

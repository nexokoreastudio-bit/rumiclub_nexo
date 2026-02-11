import { ErrorBoundary } from './ErrorBoundary';
import LandingPage from './LandingPage';

function App() {
  return (
    <ErrorBoundary>
      <LandingPage />
    </ErrorBoundary>
  );
}

export default App;

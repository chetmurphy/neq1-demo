import * as React from 'react';

import * as Sentry from '@sentry/browser';

// Sentry.init({
//  dsn: "https://990e004f6c634ea2ac0cec00daa87f3b@sentry.io/1409701"
// });
// should have been called before using it here
// ideally before even rendering your react app 

// tslint:disable-next-line:no-empty-interface
interface IErrorBoundaryProps {
}

interface IErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState>  {

  public static getDerivedStateFromError(error: string) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error });
      Sentry.withScope((scope: any) => {
        Object.keys(scope).forEach(key => {
          scope.setExtra(key, scope[key]);
        });
        Sentry.captureException(error);
      });
  }

  public render() {
    if (this.state.error) {
      // render fallback UI
      return (
        <a onClick={this.onClick}>Report feedback</a>
      );
    } else {
        // when there's not an error, render children untouched
        return this.props.children;
    }
  }

  private onClick = () => {
    return Sentry.showReportDialog()
  }
}
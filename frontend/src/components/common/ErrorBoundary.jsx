import { Component } from 'react';
import { ErrorState } from './StateViews';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-16 max-w-md px-4">
          <ErrorState message="This section ran into an unexpected problem. Your saved data is safe." onRetry={this.handleRetry} />
        </div>
      );
    }
    return this.props.children;
  }
}

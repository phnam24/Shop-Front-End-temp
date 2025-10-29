import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Oops! Có lỗi xảy ra
            </h1>

            <p className="text-gray-600 mb-6">
              Xin lỗi, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại hoặc quay về trang chủ.
            </p>

            {/* Show error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                <summary className="text-sm font-semibold text-gray-900 cursor-pointer mb-2">
                  Chi tiết lỗi (Development Only)
                </summary>
                <div className="text-xs text-gray-700 space-y-2">
                  <p className="font-mono bg-red-50 p-2 rounded">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="font-mono bg-gray-100 p-2 rounded overflow-auto max-h-40 text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="btn btn-primary w-full py-3"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Thử lại
              </button>

              <button
                onClick={this.handleReload}
                className="btn btn-outline w-full py-3"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Tải lại trang
              </button>

              <Link to="/" className="btn btn-ghost w-full py-3">
                <Home className="w-5 h-5 mr-2" />
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


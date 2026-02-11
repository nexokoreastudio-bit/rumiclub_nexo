import { Component } from 'react';

/**
 * React 에러 바운더리: 렌더 중 에러 발생 시 캐치해 콘솔에 상세 로그 출력
 */
export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] 캐치된 에러:', error);
    console.error('[ErrorBoundary] 에러 메시지:', error?.message);
    console.error('[ErrorBoundary] 스택:', error?.stack);
    console.error('[ErrorBoundary] componentStack:', errorInfo?.componentStack);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600 }}>
          <h2 style={{ color: '#c00' }}>오류가 발생했습니다</h2>
          <pre style={{ background: '#f5f5f5', padding: 12, overflow: 'auto', fontSize: 12 }}>
            {this.state.error?.message}
          </pre>
          <p style={{ fontSize: 12, color: '#666' }}>
            콘솔(F12)에서 스택 트레이스와 상세 로그를 확인하세요.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:"16px", border:"1px solid #e2e8f0", borderRadius:12, background:"#fff"}}>
          <h2 style={{margin:0, fontSize:18}}>Something went wrong</h2>
          <p style={{marginTop:8, color:"#334155"}}>
            The page hit an unexpected error. Try reloading. If it persists, your last change
            likely referenced a field that doesn’t exist.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

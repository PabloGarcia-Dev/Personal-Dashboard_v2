// src/components/auxiliary/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) {
    fetch("/crash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: String(error), stack: info.componentStack }),
    }).catch(() => {});
    setTimeout(() => window.location.reload(), 10000);
  }
  render() {
    if (this.state.error) {
      return <div className="p-6 text-red-400">Something crashed, reloading...</div>;
    }
    return this.props.children;
  }
}
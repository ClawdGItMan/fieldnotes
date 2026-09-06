export default function NotFound() {
  return (
    <main id="main" className="empty-state">
      <p className="eyebrow">404 / NOT IN THIS EDITION</p>
      <h1>This page is not in the reference.</h1>
      <p>Browse the library to find the topic you were looking for.</p>
      <a className="text-link" href="/library">
        Open the library →
      </a>
    </main>
  );
}

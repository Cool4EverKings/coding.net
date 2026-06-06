import React from 'react';
import Link from 'next/link';

export default function More() {
  return (
    <main>
      <h1>More</h1>
      <br />
      <p>nothing here for now</p>

      <Link href="/" className="red-button">Go to Home</Link>
    </main>
  );
}

import React from 'react'; // <-- Ensure this is added
import { MemoryRouter } from 'react-router-dom';  // Import MemoryRouter

import { render, screen } from '@testing-library/react';
import Content from '../pages/Content';
import Watchlist from '../pages/Watchlist';

test('renders home page', () => {
  render(
  <MemoryRouter>
  <Content />
  </MemoryRouter>
  );
  const linkElement = screen.getByText(/Trending/i);
  expect(linkElement).toBeInTheDocument();
});
test('renders watchlist page', () => {
  render(
  <MemoryRouter>
  <Watchlist />
  </MemoryRouter>
  );
  const linkElement = screen.getByText(/Watchlist Videos/i);
  expect(linkElement).toBeInTheDocument();
});

// test('displays data after fetching', async () => {
//   render(<Content />);
//   await waitFor(() => expect(screen.getByText(/Trending/i)).toBeInTheDocument());
// });

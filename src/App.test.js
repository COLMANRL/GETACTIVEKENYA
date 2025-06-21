import { render, screen } from '@testing-library/react';
import App from './App';

test('renders GA Kenya header', () => {
  render(<App />);
  const headerElement = screen.getByText(/GA Kenya/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders main hero section title (first part)', () => {
  render(<App />);
  // Just check for the first part of the text
  const titleElement = screen.getByText(/Nurture Your Mind,/i);
  expect(titleElement).toBeInTheDocument();
});

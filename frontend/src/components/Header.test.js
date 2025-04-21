import { render, screen } from '@testing-library/react';
import Header from './Header';

test('renders the header with the correct title', () => {
  render(<Header />);
  const headerElement = screen.getByText(/DeepBuilder/i);
  expect(headerElement).toBeInTheDocument();
});
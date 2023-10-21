import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('renders a vercel logo', () => {
    render(<Home />);

    const heading = screen.getByRole('link', {
      name: /By Vercel Logo/i,
    });

    // @ts-ignore
    expect(heading).toBeInTheDocument();
  });
});

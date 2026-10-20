import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import { getAutocompleteSuggestions } from './service/mapService';

jest.mock('./service/mapService', () => ({
  getAutocompleteSuggestions: jest.fn(),
  getCoordFromString: jest.fn(),
}));

// Keep the actual search controls, while isolating Leaflet and external map tiles.
jest.mock('./components/MapComponent', () => ({
  __esModule: true,
  default: ({ startPoint1, startPoint2 }: any) => (
    <output data-testid="map-points">{JSON.stringify([startPoint1, startPoint2])}</output>
  ),
}));

beforeEach(() => {
  jest.mocked(getAutocompleteSuggestions).mockImplementation((query: string) =>
    Promise.resolve({
      status: 200,
      data: [{ name: query, coordinates: query === 'Paris' ? [48.85, 2.35] : [51.5, -0.12] }],
    } as any)
  );
});

test('labels both search fields and places the swap icon between them', () => {
  render(<App />);
  const from = screen.getByLabelText('From');
  const to = screen.getByLabelText('To');
  const swap = screen.getByRole('button', { name: 'Swap From and To destinations' });
  expect(from.compareDocumentPosition(swap) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(swap.compareDocumentPosition(to) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(within(swap).getByTestId('SwapHorizIcon')).toBeInTheDocument();
});

test('swaps typed destination values and restores them on a second click', () => {
  render(<App />);
  const from = screen.getByLabelText('From');
  const to = screen.getByLabelText('To');
  const swap = screen.getByRole('button', { name: 'Swap From and To destinations' });
  fireEvent.change(from, { target: { value: 'Paris' } });
  fireEvent.change(to, { target: { value: 'London' } });
  fireEvent.click(swap);
  expect(from).toHaveValue('London');
  expect(to).toHaveValue('Paris');
  fireEvent.click(swap);
  expect(from).toHaveValue('Paris');
  expect(to).toHaveValue('London');
});

test('swaps a single destination into the empty field', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('From'), { target: { value: 'Paris' } });
  fireEvent.click(screen.getByRole('button', { name: 'Swap From and To destinations' }));
  expect(screen.getByLabelText('From')).toHaveValue('');
  expect(screen.getByLabelText('To')).toHaveValue('Paris');
});

test('swaps selected coordinates together with their destination names', async () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('From'), { target: { value: 'Paris' } });
  fireEvent.click(await screen.findByRole('option', { name: 'Paris' }));
  fireEvent.change(screen.getByLabelText('To'), { target: { value: 'London' } });
  fireEvent.click(await screen.findByRole('option', { name: 'London' }));
  expect(screen.getByTestId('map-points')).toHaveTextContent('[[48.85,2.35],[51.5,-0.12]]');
  fireEvent.click(screen.getByRole('button', { name: 'Swap From and To destinations' }));
  expect(screen.getByLabelText('From')).toHaveValue('London');
  expect(screen.getByLabelText('To')).toHaveValue('Paris');
  expect(screen.getByTestId('map-points')).toHaveTextContent('[[51.5,-0.12],[48.85,2.35]]');
});

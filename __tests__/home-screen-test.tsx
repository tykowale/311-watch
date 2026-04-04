import { fireEvent, render } from '@testing-library/react-native';
import { Keyboard } from 'react-native';

import { HomeScreenContent } from '@/components/home-screen';
import type { AddressComplaintsState } from '@/features/complaints/use-address-complaints';

function createState(overrides?: Partial<AddressComplaintsState>): AddressComplaintsState {
  return {
    query: '1 E State St',
    setQuery: jest.fn(),
    status: 'ready',
    isSearching: false,
    complaints: [
      {
        id: 'SR-100',
        type: 'Pothole in Street Complaint',
        status: 'Open',
        createdAt: '2026-04-04T12:00:00.000Z',
        address: '100 N STATE ST',
        lat: 41.88,
        lng: -87.63,
        communityArea: '32',
        ward: '42',
      },
    ],
    totalCount: 42,
    errorMessage: null,
    coordinates: {
      latitude: 41.881,
      longitude: -87.63,
    },
    search: jest.fn(),
    ...overrides,
  };
}

describe('<HomeScreenContent />', () => {
  beforeEach(() => {
    jest.spyOn(Keyboard, 'dismiss').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders a tighter landing screen before search runs', () => {
    const { getByText, queryByTestId } = render(
      <HomeScreenContent
        state={createState({ status: 'idle', complaints: [], totalCount: null, coordinates: null })}
      />
    );

    getByText('Search complaints around an address you know.');
    getByText('Start with one Chicago address.');
    expect(queryByTestId('complaint-count')).toBeNull();
  });

  test('renders result summary only after complaints load', () => {
    const { getByText, getByTestId } = render(<HomeScreenContent state={createState()} />);

    getByText('What are neighbors complaining about?');
    getByText('Search complaints around an address you know.');
    getByText('Pothole in Street Complaint');
    expect(getByTestId('complaint-count').props.children).toBe('1/42');
    getByText('First page of nearby matches');
  });

  test('lets the user search by address', () => {
    const state = createState({
      status: 'idle',
      complaints: [],
      coordinates: null,
    });

    const { getByDisplayValue, getByText } = render(<HomeScreenContent state={state} />);

    fireEvent.changeText(getByDisplayValue('1 E State St'), '1234 W Foster Ave');
    fireEvent.press(getByText('Search this address'));

    expect(state.setQuery).toHaveBeenCalledWith('1234 W Foster Ave');
    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(state.search).toHaveBeenCalled();
  });

  test('shows a loading button state while search is in flight', () => {
    const state = createState({
      status: 'loading',
      isSearching: true,
      complaints: [],
      totalCount: null,
      coordinates: null,
    });

    const { getByLabelText, getByText } = render(<HomeScreenContent state={state} />);

    getByText('Searching…');
    getByText('Search in progress. This can take a moment.');
    getByLabelText('Searching indicator');
  });
});

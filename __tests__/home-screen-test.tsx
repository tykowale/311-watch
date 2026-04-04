import { fireEvent, render } from '@testing-library/react-native';

import { HomeScreenContent } from '@/components/home-screen';
import type { NearbyComplaintsState } from '@/features/complaints/use-nearby-complaints';

function createState(overrides?: Partial<NearbyComplaintsState>): NearbyComplaintsState {
  return {
    status: 'ready',
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
    errorMessage: null,
    coordinates: {
      latitude: 41.881,
      longitude: -87.63,
    },
    refresh: jest.fn(),
    requestLocationAccess: jest.fn(),
    ...overrides,
  };
}

describe('<HomeScreenContent />', () => {
  test('renders a complaint-first dogfood screen', () => {
    const { getByText, getByTestId } = render(<HomeScreenContent state={createState()} />);

    getByText('What are neighbors complaining about?');
    getByText('Pothole in Street Complaint');
    expect(getByTestId('complaint-count').props.children).toBe(1);
  });

  test('allows retrying when location permission is missing', () => {
    const state = createState({
      status: 'permission-denied',
      complaints: [],
      coordinates: null,
    });

    const { getByText } = render(<HomeScreenContent state={state} />);

    fireEvent.press(getByText('Enable location'));
    expect(state.requestLocationAccess).toHaveBeenCalled();
  });
});

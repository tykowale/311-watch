import { fireEvent, render } from '@testing-library/react-native';

import { HomeScreen } from '@/components/home-screen';
import { initialWatchState, useWatchStore } from '@/stores/use-watch-store';

describe('<HomeScreen />', () => {
  beforeEach(() => {
    useWatchStore.setState(initialWatchState);
  });

  test('renders the NativeWind landing content', () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    getByText('311 Watch');
    getByText('Expo starter, city-ops edition.');
    expect(getByTestId('watcher-count').props.children).toBe(24);
  });

  test('updates the store-backed controls', () => {
    const { getByText, getByTestId } = render(<HomeScreen />);

    fireEvent.press(getByText('Add watcher'));
    fireEvent.press(getByText('Rotate borough focus'));

    expect(getByTestId('watcher-count').props.children).toBe(25);
    expect(getByTestId('borough-label').props.children).toBe('Brooklyn');
  });
});

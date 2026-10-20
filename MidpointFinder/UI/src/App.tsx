import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import MapComponent from './components/MapComponent';
import SearchBar, { AutocompleteSuggestion } from './components/UI/SearchBar/SearchBar';
import useApi from './hooks/useApi';
import { getCoordFromString } from './service/mapService';
import CustomIconButton from './components/UI/IconButton/CustomIconButton';

function App() {
  const [startPoint1, setStartPoint1] = useState<[number, number] | null>(null);
  const [startPoint2, setStartPoint2] = useState<[number, number] | null>(null);
  const [searchBarId, setSearchBarId] = useState<string>("");
  const [searchValues, setSearchValues] = useState<Record<string, string>>({
    "sb-1": "",
    "sb-2": "",
  });

  const formatCoordinates = (coordinates: [number, number]) =>
    `${coordinates[0]}, ${coordinates[1]}`;

  const {
    getApiHandler: fetchCoordFromString,
    isLoading: isCoordFromStringLoading,
    data: coordFromStringData,
    isSuccess: isCoordFromStringSuccess,
    error: coordFromStringError,
  } = useApi<[number, number]>();

  useEffect(() => {
    if (isCoordFromStringSuccess && coordFromStringData && searchBarId) {
      const formattedCoordinates = formatCoordinates(coordFromStringData);
      setSearchValues((prev) => ({ ...prev, [searchBarId]: formattedCoordinates }));
      if (searchBarId === "sb-1") {
        setStartPoint1(coordFromStringData);
      } else if (searchBarId === "sb-2") {
        setStartPoint2(coordFromStringData);
      }
    }
  }, [isCoordFromStringSuccess, coordFromStringData, searchBarId]);

  const updateSearchValue = (id: string, value: string) => {
    setSearchValues((prev) => ({ ...prev, [id]: value }));
  };

  const swapDestinations = () => {
    setSearchValues((prev) => ({
      ...prev,
      "sb-1": prev["sb-2"],
      "sb-2": prev["sb-1"],
    }));
    setStartPoint1(startPoint2);
    setStartPoint2(startPoint1);
  };

  const getCoordFromStringHandler = (coordString: string, searchBarId: string) => {
    setSearchBarId(searchBarId);
    fetchCoordFromString(getCoordFromString, coordString)
  }

  const onSuggestionClick = (id: string, suggestion: AutocompleteSuggestion) => {
    const coordinates: [number, number] = [
      suggestion.coordinates[0],
      suggestion.coordinates[1],
    ];

    setSearchBarId(id);
    updateSearchValue(id, suggestion.name);

    if (id === "sb-1") {
      setStartPoint1(coordinates);
    } else if (id === "sb-2") {
      setStartPoint2(coordinates);
    }
  }

  return (
    <div className={styles.App}>
      <header className="App-header">
        Time-Based Mid-Point Finder
      </header>
      <div className={styles.destinations}>
        <SearchBar
          searchBarId="sb-1"
          label="From"
          value={searchValues["sb-1"]}
          onValueChange={(value) => updateSearchValue("sb-1", value)}
          onSuggestionClick={onSuggestionClick}
          onSearch={(coordString) => getCoordFromStringHandler(coordString, "sb-1")}
        />
        <CustomIconButton
          icon="swap_horiz"
          className={styles.swapButton}
          aria-label="Swap From and To destinations"
          title="Swap destinations"
          onClick={swapDestinations}
          disabled={isCoordFromStringLoading}
        />
        <SearchBar
          searchBarId="sb-2"
          label="To"
          value={searchValues["sb-2"]}
          onValueChange={(value) => updateSearchValue("sb-2", value)}
          onSuggestionClick={onSuggestionClick}
          onSearch={(coordString) => getCoordFromStringHandler(coordString, "sb-2")}
        />
      </div>
      <MapComponent startPoint1={startPoint1} startPoint2={startPoint2} setStartPoint1={setStartPoint1} setStartPoint2={setStartPoint2} />
    </div>
  );
}

export default App;

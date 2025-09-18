import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import MapComponent from './components/MapComponent';
import SearchBar from './components/UI/SearchBar/SearchBar';
import useApi from './hooks/useApi';
import { getCoordFromString } from './service/mapService';

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

  const getCoordFromStringHandler = (coordString: string, searchBarId: string) => {
    setSearchBarId(searchBarId);
    fetchCoordFromString(getCoordFromString, coordString)
  }

  const onSuggestionClick = (id: string, suggestionCoord: [number, number]) => {
    setSearchBarId(id);
    updateSearchValue(id, formatCoordinates(suggestionCoord));
    if (id === "sb-1") {
      setStartPoint1(suggestionCoord);
    } else if (id === "sb-2") {
      setStartPoint2(suggestionCoord);
    }
  }

  return (
    <div className={styles.App}>
      <header className="App-header">
        Time-Based Mid-Point Finder
      </header>
      <div className='button-group'>
        <SearchBar
          searchBarId="sb-1"
          value={searchValues["sb-1"]}
          onValueChange={(value) => updateSearchValue("sb-1", value)}
          onSuggestionClick={onSuggestionClick}
          onSearch={(coordString) => getCoordFromStringHandler(coordString, "sb-1")}
        />
        <SearchBar
          searchBarId="sb-2"
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

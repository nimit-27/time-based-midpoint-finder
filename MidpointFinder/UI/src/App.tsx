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

  const {
    getApiHandler: fetchCoordFromString,
    isLoading: isCoordFromStringLoading,
    data: coordFromStringData,
    isSuccess: isCoordFromStringSuccess,
    error: coordFromStringError,
  } = useApi<[number, number]>();

  useEffect(() => {
    if (isCoordFromStringSuccess && coordFromStringData) {
      if (searchBarId === "sb-1") {
        setStartPoint1(coordFromStringData.reverse() as [number, number]);
      } else if (searchBarId === "sb-2") {
        setStartPoint2(coordFromStringData.reverse() as [number, number]);
      }
    }
  }, [isCoordFromStringSuccess, coordFromStringData, searchBarId]);

  const getCoordFromStringHandler = (coordString: string, searchBarId: string) => {
    fetchCoordFromString(getCoordFromString, coordString)
    setSearchBarId(searchBarId);
  }

  const onSuggestionClick = (suggestionCoord: [number, number]) => {
    if (searchBarId === "sb-1") {
      setStartPoint1(suggestionCoord);
    } else if (searchBarId === "sb-2") {
      setStartPoint2(suggestionCoord);
    }
  }

  return (
    <div className={styles.App}>
      <header className="App-header">
        Time-Based Mid-Point Finder
      </header>
      <div className='button-group'>
        <SearchBar onSuggestionClick={onSuggestionClick} onSearch={(coordString) => getCoordFromStringHandler(coordString, "sb-1")} />
        <SearchBar onSuggestionClick={onSuggestionClick} onSearch={(coordString) => getCoordFromStringHandler(coordString, "sb-2")} />
      </div>
      <MapComponent startPoint1={startPoint1} startPoint2={startPoint2} setStartPoint1={setStartPoint1} setStartPoint2={setStartPoint2} />
    </div>
  );
}

export default App;

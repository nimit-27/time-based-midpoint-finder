import { useEffect, useState } from "react";
import "./SearchBar.scss";
import useApi from "../../../hooks/useApi";
import { getAutocompleteSuggestions } from "../../../service/mapService";
import useDebounce from "../../../hooks/useDebounce";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch: (query: string) => void;
    iconClassName?: string;
    onSuggestionClick: (suggestion: [number, number]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    className,
    iconClassName = "search-icon",
    onSuggestionClick,
    ...props
}) => {
    const [query, setQuery] = useState<string>("");
    const debouncedQuery = useDebounce(query, 300);

    const {
        getApiHandler: fetchAutocompleteSuggestions,
        isLoading: isAutocompleteSuggestionsLoading,
        data: autocompleteSuggestionsData,
        isSuccess: isAutocompleteSuggestionsSuccess,
        error: autocompleteSuggestionsError,
    } = useApi<{ name: string; coordinates: [number, number] }[]>();

    const getAutocompleteSuggestionsHandler = (value: string) => {
        fetchAutocompleteSuggestions(getAutocompleteSuggestions, value);
    }

    useEffect(() => {
        if (debouncedQuery) {
            getAutocompleteSuggestionsHandler(debouncedQuery);
        }
    }, [debouncedQuery]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
    }

    const handleSearch = () => {
        if (onSearch) onSearch(query);
    }

    return (
        <div className={`search-bar ${className ?? ""}`}>
            <div className="input-container">
                <input
                    type="text"
                    className="search-input"
                    value={query}
                    placeholder="Search..."
                    onChange={handleInputChange}
                    {...props}
                />
                <span className={iconClassName}>
                    {isAutocompleteSuggestionsLoading ? (
                        <span className="loader">⏳</span> // Loader while fetching suggestions
                    ) : (
                        "🔍"
                    )}
                </span>
            </div>
            {/* Autocomplete Suggestions Dropdown */}
            {autocompleteSuggestionsData && autocompleteSuggestionsData.length > 0 && (
                <ul className="suggestions-dropdown">
                    {autocompleteSuggestionsData.map((suggestion, idx) => (
                        <li
                            key={`${suggestion.name}-${idx}`}
                            className="suggestion-item"
                            onClick={() => {
                                setQuery(suggestion.name);
                                onSuggestionClick(suggestion.coordinates);
                            }}
                        >
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;
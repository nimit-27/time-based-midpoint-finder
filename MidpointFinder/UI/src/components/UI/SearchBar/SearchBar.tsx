import { useState } from "react";
import "./SearchBar.scss";
import useApi from "../../../hooks/useApi";
import { getAutocompleteSuggestions } from "../../../service/mapService";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch: (query: string) => void;
    suggestions: string[];
    iconClassName?: string;
    onSuggestionClick: (suggestion: [number, number]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    suggestions = [],
    className,
    iconClassName = "search-icon",
    onSuggestionClick,
    ...props
}) => {
    const [query, setQuery] = useState<string>("");

    const {
        getApiHandler: fetchAutocompleteSuggestions,
        isLoading: isAutocompleteSuggestionsLoading,
        data: autocompleteSuggestionsData,
        isSuccess: isAutocompleteSuggestionsSuccess,
        error: autocompleteSuggestionsError,
    } = useApi<{ key: string; name: string; coordinates: [number, number] }[]>();

    const getAutocompleteSuggestionsHandler = (query: string) => {
        fetchAutocompleteSuggestions(getAutocompleteSuggestions, query);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        getAutocompleteSuggestionsHandler(value);
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
                    {autocompleteSuggestionsData.map((suggestion) => (
                        <li
                            key={suggestion.key}
                            className="suggestion-item"
                            onClick={() => onSuggestionClick(suggestion.coordinates)}
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
import { useEffect, useState } from "react";
import "./SearchBar.scss";
import useApi from "../../../hooks/useApi";
import { getAutocompleteSuggestions } from "../../../service/mapService";
import useDebounce from "../../../hooks/useDebounce";
import CustomIconButton from "../IconButton/CustomIconButton";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onSearch: (query: string) => void;
    iconClassName?: string;
    onSuggestionClick: (suggestion: [number, number]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    className,
    iconClassName = "",
    onSuggestionClick,
    ...props
}) => {
    const [query, setQuery] = useState<string>("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const debouncedQuery = useDebounce(query, 300);

    const {
        getApiHandler: fetchAutocompleteSuggestions,
        isLoading: isAutocompleteSuggestionsLoading,
        data: autocompleteSuggestionsData,
    } = useApi<{ name: string; coordinates: [number, number] }[]>();

    const getAutocompleteSuggestionsHandler = (value: string) => {
        fetchAutocompleteSuggestions(getAutocompleteSuggestions, value);
    }

    useEffect(() => {
        if (!debouncedQuery) {
            setIsMenuOpen(false);
            return;
        }

        if (isMenuOpen) {
            getAutocompleteSuggestionsHandler(debouncedQuery);
        }
    }, [debouncedQuery, isMenuOpen]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        setIsMenuOpen(!!value.trim());
    }

    const handleSearch = () => {
        if (onSearch) onSearch(query);
        setIsMenuOpen(false);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
        }
    }

    const handleSuggestionSelect = (suggestion: { name: string; coordinates: [number, number] }) => {
        setQuery(suggestion.name);
        onSuggestionClick(suggestion.coordinates);
        if (onSearch) onSearch(suggestion.name);
        setIsMenuOpen(false);
    }

    const shouldRenderSuggestions =
        isMenuOpen &&
        !!autocompleteSuggestionsData?.length &&
        !isAutocompleteSuggestionsLoading;

    const iconClasses = `search-icon ${iconClassName ?? ""} ${isAutocompleteSuggestionsLoading ? "loading" : ""}`.trim();

    return (
        <div className={`search-bar ${className ?? ""}`}>
            <div className="input-container">
                <input
                    type="text"
                    className="search-input"
                    value={query}
                    placeholder="Get Path"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    {...props}
                />
                <CustomIconButton
                    icon={isAutocompleteSuggestionsLoading ? "autorenew" : "search"}
                    className="search-icon-button"
                    iconClassName={iconClasses}
                    onClick={handleSearch}
                    aria-label={isAutocompleteSuggestionsLoading ? "Loading suggestions" : "Search"}
                    disabled={isAutocompleteSuggestionsLoading}
                />
            </div>
            {/* Autocomplete Suggestions Dropdown */}
            {shouldRenderSuggestions && (
                <div className="suggestions-dropdown" role="listbox">
                    {autocompleteSuggestionsData.map((suggestion, idx) => (
                        <button
                            key={`${suggestion.name}-${idx}`}
                            type="button"
                            className="suggestion-item"
                            onClick={() => handleSuggestionSelect(suggestion)}
                            role="option"
                        >
                            {suggestion.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
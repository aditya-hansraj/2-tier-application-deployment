import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { EntryType, EntryContextType } from "../types/components";
import { deleteRequest, getRequest, postRequest, putRequest } from "../utils/services";
import { useAuth } from "./auth.context";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
const BASE_URL = `${BACKEND_URL}/api/entries`;

const EntryContext = createContext<EntryContextType | undefined>(undefined);

export const EntryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [searchKey, setSearchKey] = useState<string | null>(null);
  const [filteredEntries, setFilteredEntries] = useState<EntryType[]>(entries);
  // add entry
  const [newEntryTitle, setNewEntryTitle] = useState<string | null>(null);
  const [newEntryTags, setNewEntryTags] = useState<string[]>([]);
  const [newEntryContent, setNewEntryContent] = useState<string | null>(null);

  const navigate = useNavigate();

  const updateNewEntryTitle = useCallback((newTitle: string) => {
    setNewEntryTitle(newTitle);
  }, []);

  const updateNewEntryTags = useCallback((tags: string[]) => {
    setNewEntryTags(tags);
  }, []);

  const updateNewEntryContent = useCallback((content: string) => {
    setNewEntryContent(content);
  }, []); 

  const { jwtToken, isAuthenticated } = useAuth();

  const getEntries = useCallback(async (): Promise<void> => {
    setEntriesLoading(true);
    const response = await getRequest(BASE_URL, jwtToken);
    setEntriesLoading(false);
    if (response.error) return;
    setEntries(response.data.entries);
  }, [jwtToken]);

  const addEntry = useCallback(async () => {
    const response = await postRequest(
      `${BASE_URL}/create`,
      JSON.stringify({
        title: newEntryTitle,
        tags: newEntryTags.join(','),
        body: newEntryContent
      }),
      jwtToken
    );

    if(response.error) {
      return console.error(response)
    }
    // setEntries((prev) => [...prev, response.data.entry]);
    setNewEntryContent(null);
    setNewEntryTags([]);
    setNewEntryTitle(null);

    const newEntry = response.data.entry as EntryType;
    setEntries((prev) => [...prev, newEntry]);
    console.log(`Successfully added new Entry: `, newEntry);  
    navigate('/diaries');
    
  }, [jwtToken, newEntryTitle, newEntryTags, newEntryContent]);

  const updateEntry = useCallback(
    async (id: string, updatedEntryData: { title?: string; body?: string; tags?: string[] }) => {
      const response = await putRequest(
        `${BASE_URL}/update/${id}`,
        JSON.stringify(updatedEntryData),
        jwtToken
      );
  
      if (response.error) {
        console.log(response.error);
        return;
      }
  
      // Update the state with the updated entry
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry._id === id ? { ...entry, ...response.data.entry } : entry
        )
      );
    },
    [jwtToken]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      const response = await deleteRequest(`${BASE_URL}/delete/${id}`, jwtToken);

      if (response.error) {
        console.error("Failed to delete entry:", response.error);
        return;
      }

      // Remove the deleted entry from the state
      setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
      navigate("/diaries");
    },
    [jwtToken, navigate]
  );
  

  const updateSearchKey = useCallback((event: any) => {
    setSearchKey("" + event.target.value);
  }, []);

  const filterEntries = useCallback(() => {
    if (searchKey === null || searchKey.trim() === "") {
      setFilteredEntries(entries);
      return;
    }

    const lowercasedSearchKey = searchKey.toLowerCase();

    const filtered = entries.filter((entry: EntryType) => {
      const lowercasedTitle = entry.title.toLowerCase();
      const lowercasedTags = entry.tags.map((tag) => tag.toLowerCase());

      return (
        lowercasedTitle.includes(lowercasedSearchKey) ||
        lowercasedTags.some((tag) => tag.includes(lowercasedSearchKey))
      );
    });

    setFilteredEntries(filtered);
  }, [entries, searchKey]); 

  // Call filterEntries whenever searchKey changes
  useEffect(() => {
    filterEntries();
  }, [searchKey, filterEntries]);

  useEffect(() => {
    if (isAuthenticated) getEntries();
  }, [getEntries]);

  return (
    <EntryContext.Provider
      value={{
        entries,
        entriesLoading,
        searchKey,
        updateSearchKey,
        filterEntries,
        filteredEntries,
        newEntryTitle,
        newEntryTags,
        newEntryContent,
        updateNewEntryTitle,
        updateNewEntryTags,
        updateNewEntryContent,
        addEntry,
        updateEntry,
        deleteEntry
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export const useEntryContext = (): EntryContextType => {
  const context = useContext(EntryContext);
  if (context == undefined) throw new Error("UseEntryContextError");
  return context;
};

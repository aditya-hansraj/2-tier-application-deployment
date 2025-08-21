import { Container } from "react-bootstrap";
import Entry from "../components/Entry/Entry";
import { useEntryContext } from "../contexts/entry.context";
import HashLoader from "../components/Entry/HashLoader";
import EntryHeader from "../components/Entry/EntryHeader";

export default function DiaryEntries() {
  const { filteredEntries, entriesLoading } = useEntryContext();

  return (
    <Container>
      <EntryHeader />
      {entriesLoading ? (
        <HashLoader />
      ) : filteredEntries.length ? (
        filteredEntries.map((entry) => (
          <Entry 
            entry={entry}
            key={entry._id}
          />
        ))
      ) : !entriesLoading &&(
        <h3 className="text-center my-5">No Entries Found...</h3>
      )}
    </Container>
  );
}

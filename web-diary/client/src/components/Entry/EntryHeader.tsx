import { Button, Form } from "react-bootstrap";
import { TfiWrite } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { useEntryContext } from "../../contexts/entry.context";

const EntryHeader = () => {
  const { updateSearchKey, searchKey } = useEntryContext();
  return (
    <div className="entry-header d-flex justify-content-between p-4">
      <Button>
        <Link to="/addentry" className="text-decoration-none text-light px-1">
          <span className="px-3">Add New Entry</span>
          <TfiWrite />
        </Link>
      </Button>
      <Form className="display-form d-flex w-33">
        <Form.Control
          className={`mx-2 rounded-pill`}
          type="text"
          placeholder="Search by title or tags"
          value={searchKey ? searchKey : ""}
          onChange={updateSearchKey}
        />
      </Form>
    </div>
  );
};

export default EntryHeader;

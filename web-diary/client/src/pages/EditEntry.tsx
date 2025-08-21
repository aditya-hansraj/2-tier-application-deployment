import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEntryContext } from "../contexts/entry.context";
import { EntryType } from "../types/components";
import { Container, Form, Button } from "react-bootstrap";
import Tag from "../components/Entry/Tag";

const EditEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { entries, updateEntry } = useEntryContext();
  const [entry, setEntry] = useState<EntryType | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedEntry = entries.find((entry) => entry._id === id);
    if (selectedEntry) {
      setEntry(selectedEntry);
      setTitle(selectedEntry.title);
      setBody(selectedEntry.body);
      setTags(selectedEntry.tags);
    }
  }, [id, entries]);

  function handleKeyDown(event: any) {
    if (event.key == "Enter") {
      const value = event.target.value.trim().toLowerCase();
      const isAlphabetic = /^[a-zA-Z]+$/.test(value);
      const isDuplicate = tags.includes(value);

      if (value && isAlphabetic && !isDuplicate) {
        setTags([...tags, value]);
        event.target.value = "";
      }
    }
  }

  const deleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSave = async () => {
    if (id) {
      const updatedEntry = {
        title,
        body, 
        tags 
      } as EntryType;
      updateEntry(id, updatedEntry);
      navigate(`/entries/${id}`);
    }
  };

  return (
    <Container className="my-4 p-4 shadow-sm rounded">
      <h2>Edit Entry</h2>
      <Form>
        <Form.Group controlId="entryTitle" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="entryBody" className="mb-3">
          <Form.Label>Body</Form.Label>
          <Form.Control
            as="textarea"
            rows={15}
            value={body}
            name="body"
            onChange={(e) => setBody(e.target.value)}
          />
        </Form.Group> 
        <Form.Group controlId="entryTags" className="mb-3">
          <Form.Label>Tags</Form.Label>
          <Form.Control
            type="text"
            onKeyDown={handleKeyDown}
            disabled={tags.length == 5}
          />
          <div className="tags d-flex my-3">
            {tags.map((tag, index) => (
                <Tag delete={true} tag={tag} key={index} deleteTag={deleteTag} />
            ))}
          </div>
        </Form.Group>

        <Button variant="primary" onClick={handleSave} className="w-100" disabled={!title || !body || !entry}>
          Save
        </Button>
      </Form>
    </Container>
  );
};

export default EditEntry;
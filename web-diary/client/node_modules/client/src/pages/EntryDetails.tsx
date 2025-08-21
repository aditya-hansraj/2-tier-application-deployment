import React, { useEffect, useState,  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEntryContext } from "../contexts/entry.context";
import { EntryType } from "../types/components";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { useTheme } from "../contexts/theme.context";
import Tag from "../components/Entry/Tag";

const EntryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { entries, deleteEntry } = useEntryContext();
  const [entry, setEntry] = useState<EntryType | null>(null);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const selectedEntry = entries.find((entry) => entry._id === id);
    if (selectedEntry) setEntry(selectedEntry);
  }, [id, entries]);

  if (!entry) return <div>Entry not found</div>;

  return (
    <Container className={`my-4 p-4 shadow-sm rounded ${darkMode ? "bg-dark" : "bg-light"}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">{entry.title}</h1>
        <div>
          <Dropdown align="end">
            <Dropdown.Toggle variant={darkMode ? "dark" : "light"} id="dropdown-basic">
              
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate(`/entries/${id}/edit`)}>Edit</Dropdown.Item>
              <Dropdown.Item onClick={() => {deleteEntry(entry._id)}}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <Row>
        <Col>
          <p className="mb-4">{entry.body}</p>
          <div className="d-flex flex-wrap">
            {entry.tags.map((tag, index) => (
              <Tag tag={tag} key={index} />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EntryDetails;

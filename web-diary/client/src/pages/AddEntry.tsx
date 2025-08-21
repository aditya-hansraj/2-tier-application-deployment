import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "react-bootstrap";
import Page1 from "../components/Entry/addEntry/Page1";
import Page2 from "../components/Entry/addEntry/Page2";
import { useEntryContext } from "../contexts/entry.context";

const AddEntry: React.FC = () => {
  const [page, setPage] = useState<1 | 2>(1);
  const { newEntryTitle, newEntryTags, newEntryContent, addEntry } = useEntryContext();

  return (
    <div className="container entry-form d-flex justify-content-around sm:flex-column">
      {page == 1 ? (
        <Page1 />
      ) : (
        <Page2 title={newEntryTitle ? newEntryTitle : ""} tags={newEntryTags} />
      )}
      <Button
        className="fs-3 px-3"
        onClick={() => {
          if(page == 1 && newEntryTitle) setPage(2);
          if(page == 2) addEntry();
        }}
      >
        {page == 1 ? (
          <span>
            <span className="mx-4">Next</span>
            <FaArrowRight />
          </span>
        ) : (
          <span className="d-flex flex-column">
            <span className="mx-4">Create</span>
            <span
              className={`content-size-count ${
                newEntryContent && newEntryContent.length === 1000
                  ? "text-red"
                  : ""
              }`}
            >
              ({newEntryContent ? newEntryContent.length : "0"} / 1000)
            </span>
          </span>
        )}
      </Button>
    </div>
  );
};

export default AddEntry;

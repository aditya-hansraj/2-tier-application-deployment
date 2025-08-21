import moment from "moment";
import { useTheme } from "../..//contexts/theme.context";
import { Link } from "react-router-dom";
import Tag from "./Tag";
import { EntryType } from "../../types/components";

const Entry = (props: {entry: EntryType }) => {
  const entry = props.entry;
  const title = entry.title;
  const tags = entry.tags;
  const date = moment(entry.createdAt).calendar();
  const { darkMode } = useTheme();
  return (
    <div
      className={`entry rounded d-flex justify-content-between m-3 px-4 py-3 ${darkMode ? "bg-dark" : "bg-light"}`}
    >
      <div className="left">
        <Link to={`/entries/${props.entry._id}`} className="text-decoration-none">
          <h3 className={`entry-title ${darkMode ? "text-light" : "text-dark"} `}>
            {title}
          </h3>
        </Link>
        <div className="tags mt-4">
          {tags.map((tag, index) => {
            return (
              <Tag key={index} tag={tag} delete={false} />
            );
          })}
        </div>
      </div>
      <div className="right">
        <p className="entry-date">{date}</p>
      </div>
    </div>
  );
};

export default Entry;

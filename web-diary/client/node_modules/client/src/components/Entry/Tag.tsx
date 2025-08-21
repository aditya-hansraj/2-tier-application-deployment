import { useTheme } from "../../contexts/theme.context";
import { IoCloseSharp } from "react-icons/io5";

const Tag = (props: {
  tag: string;
  delete?: boolean;
  deleteTag?: (tagToDelete: string) => void;
}) => {
  const { darkMode } = useTheme();
  return (
    <div
      className="d-inline tag mx-2 px-3 py-1 border border-1 rounded-pill"
      style={{ width: "fit-content" }}
    >
      <span className={`mx-2`}>{props.tag}</span>
      {props.delete && (
        <span
          role="button"
          style={{ marginLeft: ".7em" }}
          className={`${darkMode ? "text-light" : "text-dark"}`}
          onClick={() => {
            if(props.deleteTag) props.deleteTag(props.tag)
          }}
        >
          <IoCloseSharp />
        </span>
      )}
    </div>
  );
};

export default Tag;

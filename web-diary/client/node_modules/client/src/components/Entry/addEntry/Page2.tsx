import Tag from "../Tag";
import { useTheme } from "../../../contexts/theme.context";
import { useEntryContext } from "../../../contexts/entry.context";

const Page2 = (props: { title: string; tags: string[] }) => {
  const { darkMode } = useTheme();
  const { newEntryContent, updateNewEntryContent } = useEntryContext();

  const handleChange = (event: any) => {
    updateNewEntryContent(event.target.value);
  }
  return (
    <div className="page-2 flex my-5 w-100 m-5">
      <header className="mt-5">
        <h1 className="mx-4">{props.title}</h1>
        <div className="tags d-flex mx-4 my-2">
          {props.tags.map((tag, index) => (
            <Tag delete={false} tag={tag} key={index} />
          ))}
        </div>
      </header>
      <hr />
      <textarea maxLength={1000}
        rows={16}
        className={`content px-4 ${darkMode ? "text-light" : "text-dark"}`}
        placeholder="Write Your Heart Out !!!"
        value={newEntryContent ? newEntryContent : ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default Page2;

import { InputText } from 'primereact/inputtext';
import { Form } from 'react-bootstrap';
import { useTheme } from '../../../contexts/theme.context';
import Tag from '../Tag';
import { useEntryContext } from '../../../contexts/entry.context';

const Page1 = () => {
    const { darkMode } = useTheme();       
    const { newEntryTitle, newEntryTags, updateNewEntryTitle, updateNewEntryTags } = useEntryContext();
  
    function handleTitleChange(event: any) {
      updateNewEntryTitle(event.target.value);
    }
  
    function handleKeyDown(event: any) {
      if (event.key == "Enter") {
        const value = event.target.value.trim().toLowerCase();
        const isAlphabetic = /^[a-zA-Z]+$/.test(value);
        const isDuplicate = newEntryTags.includes(value);
  
        if (value && isAlphabetic && !isDuplicate) {
          updateNewEntryTags([...newEntryTags, value]);
          event.target.value = "";
        }
      }
    }
  
    const deleteTag = (tagToDelete: string) => {
      updateNewEntryTags(newEntryTags.filter((tag) => tag !== tagToDelete));
    };

  return (
    <Form className="form d-flex flex-column">
        <input
          className={`input ${darkMode ? "text-white" : "text-dark"} mb-3`}
          placeholder="Entry Title"
          value={newEntryTitle ? newEntryTitle : ""}
          onChange={handleTitleChange}
        />
        <InputText
          className={`input ${darkMode ? "text-white" : "text-dark"} my  -2`}
          placeholder="Entry Tags"
          onKeyDown={handleKeyDown}
          disabled={newEntryTags.length == 5}
        />
        <div className="tags d-flex my-3">
          {newEntryTags.map((tag, index) => (
            <Tag delete={true} tag={tag} key={index} deleteTag={deleteTag} />
          ))}
        </div>
      </Form>
  )
}

export default Page1; 
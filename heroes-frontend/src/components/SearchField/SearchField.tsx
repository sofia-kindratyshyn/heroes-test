import { Link } from "react-router-dom";
import css from "./SearchField.module.css";

interface SearchFieldProps {
  getValue: (value: string) => void;
  value: string;
}

export default function SearchField({ value, getValue }: SearchFieldProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    getValue(event.target.value);
  }
  return (
    <div className={css.searchWrapper}>
      <div className={css.searchBox}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Search superheroes..."
        />
      </div>
      <Link to={"/create"} className={css.createBtn}>
        + New Hero
      </Link>
    </div>
  );
}

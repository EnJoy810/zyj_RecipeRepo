import SearchBox from "@/components/SearchBox";
import useSearchStore from "@/store/useSearchStore.js";
import styles from "./search.module.css";
import useTitle from "@/hooks/useTitle";
import { useState, memo, useRef } from "react";
import { Dialog } from "react-vant";
import { DeleteO, Cross } from "@react-vant/icons";

const SearchHistory = memo((props) => {
  const { searchHistory, deleteIcon, onDeleteItem } = props;

  const handleHistoryClick = (e) => {
    if (e.target.closest(`.${styles.cross}`)) {
      const itemElement = e.target.closest(`.${styles.item}`);
      if (itemElement) {
        const timestamp = Number(itemElement.dataset.timestamp);
        onDeleteItem(timestamp);
      }
    }
  };

  return (
    <div className={styles.history} onClick={handleHistoryClick}>
      {searchHistory.map((item) => (
        <div
          key={item.timestamp}
          className={styles.item}
          data-timestamp={item.timestamp}
        >
          {item.text}
          {deleteIcon && <Cross className={styles.cross} />}
        </div>
      ))}
    </div>
  );
});

const Search = () => {
  const [query, setQuery] = useState("");
  const [deleteIcon, setDeleteIcon] = useState(false);
  const queryRef = useRef(null);
  const {
    suggestList,
    setSuggestList,
    searchHistory,
    addSearchHistory,
    removeSearchHistory,
    deleteSearchHistory,
  } = useSearchStore();

  const suggestListStyle =
    query !== "" ? { display: "block" } : { display: "none" };
    
  useTitle("食谱搜索"); 

  const handleQuery = (query) => {
    setQuery(query);
    if (!query) {
      return;
    }
    setSuggestList(query);
  };

  const handleClickRemove = () => {
    Dialog.confirm({
      title: "确认删除全部搜索历史吗？",
    })
      .then(() => {
        removeSearchHistory();
      })
      .catch(() => {});
  };

  const handleClickAddSearchHistory = (e) => {
    const itemElement = e.target.closest(`.${styles.item}`);
    if (itemElement) {
      const itemText = itemElement.textContent;
      addSearchHistory(itemText);
      setQuery("");
      if (queryRef.current) {
        queryRef.current.clear();
      }
    }
  };

  return (
    <div className={styles.container}>
      <SearchBox handleQuery={handleQuery} addSearchHistory={addSearchHistory} ref={queryRef} />
      <div className={styles.historyTitle}>
        <h1>搜索历史</h1>
        {!deleteIcon ? (
          <DeleteO
            className={styles.deleteIcon}
            onClick={() => setDeleteIcon(true)}
          />
        ) : (
          <div className={styles.deleteSpan}>
            <span onClick={handleClickRemove}>全部删除</span>
            <span onClick={() => setDeleteIcon(false)}>
              | 完成
            </span>
          </div>
        )}
      </div>
      <SearchHistory searchHistory={searchHistory} deleteIcon={deleteIcon} onDeleteItem={deleteSearchHistory} />
      <div className={styles.list} style={suggestListStyle} onClick={handleClickAddSearchHistory}>
        {suggestList.map((item) => (
          <div key={item} className={styles.item}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
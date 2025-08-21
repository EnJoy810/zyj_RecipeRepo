import {
  memo,
  useRef,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
} from "react";
import React from "react";
import { ArrowLeft, Close, Search } from "@react-vant/icons";
import { Sticky } from "react-vant";
import debounce from "@/utils/debounce";
import styles from "./searchbox.module.css";

const SearchBox = React.forwardRef((props, ref) => {
  const [query, setQuery] = useState("");
  const { handleQuery, addSearchHistory } = props;
  const queryRef = useRef(null);
  
  const handleChange = (e) => {
    let val = e.currentTarget.value;
    setQuery(val);
  };
  
  const clearQuery = () => {
    setQuery("");
    if (queryRef.current) {
        queryRef.current.value = "";
        queryRef.current.focus();
    }
  };

  const handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 500);
  }, [handleQuery]);

  const displayStyle = query ? { display: "block" } : { display: "none" };

  useEffect(() => {
    handleQueryDebounce(query);
  }, [query, handleQueryDebounce]);

  const handleClickAddSearchHistory = () => {
    if (query) {
      addSearchHistory(query);
      clearQuery();
    }
  };

  useImperativeHandle(ref, () => ({
    current: queryRef.current,
    clear: () => {
      setQuery("");
      if (queryRef.current) {
          queryRef.current.value = "";
          queryRef.current.focus();
      }
    },
  }));

  return (
    <div className={styles.wrapper}>
      <Sticky className={styles.sticky}>
        <ArrowLeft
          onClick={() => history.go(-1)}
          className={styles.arrowleft}
        />
        <Search className={styles.icon} />
        <input
          type="text"
          className={styles.input}
          // 修改：更新提示文字
          placeholder="搜菜谱、搜食材..." 
          ref={queryRef}
          onChange={handleChange}
        />
        <Close
          onClick={clearQuery}
          style={displayStyle}
          className={styles.close}
        />
        <span className={styles.search} onClick={handleClickAddSearchHistory}>
          搜索
        </span>
      </Sticky>
    </div>
  );
});

export default memo(SearchBox);
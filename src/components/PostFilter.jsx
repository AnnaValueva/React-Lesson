import React from 'react';
import MyInput from './UI/input/MyInput';
import MySelect from './UI/select/MySelect';


// поскольку вынесли все в отдельный компонент, теперь передается через props
const PostFilter = ({filter, setFilter}) => {
  return (
    <div>
        <MyInput 
          value={filter.query}
          onChange={e => setFilter({...filter, query: e.target.value})}
          placeholder="Search"
        />
        <MySelect 
          value={filter.sort}
          onChange={selectedSort => setFilter({...filter, sort: selectedSort})}
          defaultValue="Sort by"
          option={[
            {value: 'title', name: 'name'},
            {value: 'body', name: 'description'}
          ]}
        />
      </div>
  );
}

export default PostFilter;
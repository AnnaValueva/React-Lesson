import React, { useEffect, useState, useRef } from "react";
import PostService from "../API/PostService";
import PostFilter from "../components/PostFilter";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import MyModal from '../components/UI/MyModal/MyModal';
import MyButton from "../components/UI/button/MyButton";
import Loader from "../components/UI/loader/Loader";
import Pagination from "../components/UI/pagination/Pagination";
import { useFetching } from "../hooks/useFetching";
import { usePosts } from "../hooks/usePosts";
import { getPageCount } from "../utils/pages";
import { useObserver } from "../hooks/useObserver";
import MySelect from "../components/UI/select/MySelect";

function Posts() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState({sort: '', query: ''})
  const [modal, setModal] = useState(false);


  // состояние где возвращается 100 постов
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)

  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)

  // получение ссылки на дом элемент который последний в списке
  const lastElement = useRef()



  // переделали на response обратно для пагинации
  const [fetchPosts, isPostsLoading, postError] = useFetching( async() => {
    const response = await PostService.getAll(limit, page);
      setPosts([...posts, ...response.data])
      const totalCount = response.headers['x-total-count'];
      setTotalPages(getPageCount(totalCount, limit))
  })

  useObserver(lastElement, page < totalPages, isPostsLoading, () => {
    setPage ( page + 1 )
  })

  // массив зависимостей пустой чтобы функция отработала ЕДИНОЖДЫ
  // добавлена страница в массив зависимостей чтобы на каждое изменение стр подгружались посты
  useEffect(() => {
    fetchPosts(limit, page)
  }, [page]) 

  // создаем функцию которая на вход будет ожидать новый пост
  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }

  // удаление постов тоже через callBack
  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  const changePage = (page) => {
    setPage(page)
    
  }

  return (
    <div className="App">
      {/* <button onClick={fetchPosts}>GET POSTS</button> */}
      <MyButton
        style={{marginTop: 30}}
        onClick={() => setModal(true)}
      >
        Make A Post
      </MyButton>
      <MyModal 
        visible={modal} 
        setVisible={setModal}
        >
        <PostForm create={createPost}/>
      </MyModal>

      <hr style={{margin: '15px 0'}}/>

      <PostFilter 
        filter={filter}
        setFilter={setFilter}
      />

      {/* <MySelect
        value={limit}
        onChange={value => setLimit(value)}
        defaultValue='Numbet of elements'
        options={[
          {value: 5, name: '5'},
          {value: 10, name: '10'},
          {value: 25, name: '25'},
          {value: -1, name: 'Show All'}
        ]}
      /> */}

    {postError &&
      <h1>Something went wrong ${postError}</h1>
    }
    <PostList
        remove={removePost}
        posts={sortedAndSearchedPosts}
        title='Список постов 1'
    />
    <div
      ref={lastElement}
      style={{height: 20, background: 'red'}}>
      
    </div>
    {isPostsLoading &&
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
    }
      
    
    
      <Pagination
        page={page}
        changePage={changePage}
        totalPages={totalPages}
      />
    </div>
  );
}

export default Posts;

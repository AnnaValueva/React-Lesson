import React, { useEffect, useState } from "react";
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

function Posts() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState({sort: '', query: ''})
  const [modal, setModal] = useState(false);


  // состояние где возвращается 100 постов
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)

  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)


  // переделали на response обратно для пагинации
  const [fetchPosts, isPostsLoading, postError] = useFetching( async() => {
    const response = await PostService.getAll(limit, page);
      setPosts(response.data)
      const totalCount = response.headers['x-total-count'];
      setTotalPages(getPageCount(totalCount, limit))
  })


  // массив зависимостей пустой чтобы функция отработала ЕДИНОЖДЫ
  useEffect(() => {
    fetchPosts(limit, page)
  }, []) 

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
    fetchPosts(limit, page)
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

    {postError &&
      <h1>Something went wrong ${postError}</h1>
    }
    {isPostsLoading
      ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
      : <PostList
        remove={removePost}
        posts={sortedAndSearchedPosts}
        title='Список постов 1'
      />
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

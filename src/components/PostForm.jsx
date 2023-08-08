import React, { useState } from 'react';
import MyInput from './UI/input/MyInput';
import MyButton from './UI/button/MyButton';

// чтобы все работала props не помогут ибо идут от РОДИТЕЛЯ к ДОЧЕРНЕМУ элементу
// необходимо использовать callback который идет от родителя к дочернему элементу и ожидает возвращения


// вызов созданной функции в APP
const PostForm = ({create}) => {
  const [post, setPost] = useState({title: '', body: ''})

  const addNewPost = (e) => {
    e.preventDefault()
    const newPost = {
      ...post, id: Date.now()
    }
    create(newPost)
    setPost({title: '', body: ''})
  }

  return (
      <form>
        <MyInput 
          value={post.title}
          onChange={e => setPost({...post, title: e.target.value})}
          type='text' 
          placeholder="Post Name"
        />

        <MyInput 
          value={post.body}
          onChange={e => setPost({...post, body: e.target.value})}
          type='text' 
          placeholder="Post Description"
        />

        <MyButton onClick={addNewPost}>Make a Post</MyButton>
      </form>
  );
}

export default PostForm;
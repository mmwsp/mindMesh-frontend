import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, getCategories } from '../store/postSlice';
import styles from '../styles/CreatePost.module.scss';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const categories = useSelector((state) => state.posts.categories)
  const [editorHtml, setEditorHtml] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = useSelector((state) => state.auth.user.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const post = {
    title: title,
    author_id: userId,
    categories: selectedCategories.join(', '),
    content: editorHtml,
  };

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch]);

  const modules = {
    toolbar: [
      [{ 'header': '2' }, { 'font': [] }],
      ['bold', 'italic', 'underline'],
      ['link'],
      ['image'],
    ],
  };

  const handleEditorChange = (html) => {
    setEditorHtml(html);

    const imageCount = (html.match(/<img/g) || []).length;
    const textLength = html.replace(/<[^>]*>/g, '').length;

    if (imageCount > 3 || textLength > 3500) {
      if (imageCount > 3) {
        alert('Превышено максимальное количество изображений (максимум 3).');
      }
      if (textLength > 350) {
        alert('Превышено максимальное количество символов (максимум 350).');
      }
      const cleanedHtml = html.replace(/<img[^>]*>/g, (match, offset) => {
        if (offset >= 3 * 50) {
          return '';
        }
        return match;
      });
      const truncatedHtml = cleanedHtml.slice(0, 3500);
      setEditorHtml(truncatedHtml);
    }
  };

  const handleCategoryChange = (categoryTitle) => {
    if (selectedCategories.includes(categoryTitle)) {
      setSelectedCategories(selectedCategories.filter(category => category.title !== categoryTitle));
    } else {
      setSelectedCategories([...selectedCategories, categoryTitle]);
    }
  
  };

  const handleSubmit = async () => {
    if (!title || title.length < 4) {
      alert('Title is too small.');
      return;
    }
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        console.log(post);
        await dispatch(createPost(post));
        navigate("/myprofile", {replace: true})
      } catch (error) {
        console.error('Error creating post:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.createPostContainer}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        className={styles.title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className={styles.categoryContainer}>
        {categories.map((category) => (
          <div
          key={category.id}
          className={`${styles.category} ${selectedCategories.includes(category.title) ? styles.selected : ''}`}
          onClick={() => handleCategoryChange(category.title)}
        >
          {category.title}
        </div>
        ))}
      </div>
      <ReactQuill
        value={editorHtml}
        onChange={handleEditorChange}
        modules={modules}
        className={styles.quillContainer}
      />
      <button onClick={handleSubmit}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default CreatePost;
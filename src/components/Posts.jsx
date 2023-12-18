import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../store/postSlice';
import Post from './PostCard';
import styles from '../styles/Posts.module.scss';

function Posts() {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.list);
    const status = useSelector((state) => state.posts.status);
    const categories = useSelector((state) => state.posts.categories);

    const [filteredPosts, setFilteredPosts] = useState(posts);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      applyFilters();
    }, [posts, selectedCategory, searchTerm]);

    useEffect(() => {
        if (status === 'idle' || !posts.length) {
          dispatch(fetchPosts());
        }
      }, [dispatch, status]);
    
     /* if (status === 'loading') {
        return <div>Loading...</div>;
      }*/
    
      if (status === 'failed') {
        return <div>Error loading posts </div>; //{error}
      }
    
      const applyFilters = () => {
        let filtered = posts;
    
 
        if (selectedCategory !== 'all') {
          filtered = filtered.filter((post) => post.categories.includes(selectedCategory));
        }
    
     
        if (searchTerm.trim() !== '') {
          filtered = filtered.filter((post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
    
     
        setFilteredPosts(filtered);
      };
    
      const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
      };
    
      const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
      };

  return (
    <div className={styles.postsContainer}>
       <div className={styles.filterContainer}>
      <select
        className={styles.selectInput}
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.title}>
            {category.title}
          </option>
        ))}
      </select>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
      <div>

        <div>
          {filteredPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
        
      </div>
    </div>
  );
}

export default Posts;

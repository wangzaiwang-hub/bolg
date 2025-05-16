import React, { useState, useEffect } from 'react';
import { blogService } from '../../lib/supabase';
import { marked } from 'marked';

// 文章列表组件
const PostsList = ({ posts, onEdit, onDelete, onView, onCreateNew }) => {
  return (
    <div className="posts-list">
      <div className="list-header">
        <h2>博客文章管理</h2>
        <button onClick={onCreateNew} className="create-button">新建文章</button>
      </div>
      
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>暂无文章，点击"新建文章"开始创建</p>
        </div>
      ) : (
        <table className="posts-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>发布日期</th>
              <th>分类</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{new Date(post.date).toLocaleDateString('zh-CN')}</td>
                <td>{post.categories}</td>
                <td className="action-buttons">
                  <button onClick={() => onView(post)} className="view-button">查看</button>
                  <button onClick={() => onEdit(post)} className="edit-button">编辑</button>
                  <button onClick={() => onDelete(post.id)} className="delete-button">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <style>{`
        .posts-list {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .list-header h2 {
          margin: 0;
        }
        .create-button {
          background-color: var(--vh-main-color, #01C4B6);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .create-button:hover {
          background-color: var(--vh-main-color-dark, #00a19a);
        }
        .posts-table {
          width: 100%;
          border-collapse: collapse;
        }
        .posts-table th, .posts-table td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .posts-table th {
          font-weight: 600;
          color: #555;
        }
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .action-buttons button {
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .view-button {
          background-color: #4CAF50;
          color: white;
        }
        .edit-button {
          background-color: #2196F3;
          color: white;
        }
        .delete-button {
          background-color: #F44336;
          color: white;
        }
        .no-posts {
          padding: 2rem;
          text-align: center;
          color: #666;
        }
      `}</style>
    </div>
  );
};

// 文章编辑器组件
const PostEditor = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [categories, setCategories] = useState(post?.categories || '');
  const [tags, setTags] = useState(post?.tags ? post.tags.join(', ') : '');
  const [cover, setCover] = useState(post?.cover || '');
  const [id, setId] = useState(post?.id || '');
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const parseMarkdown = (markdownText) => {
    return { __html: marked(markdownText) };
  };
  
  const handleSave = async () => {
    setSaving(true);
    try {
      // 解析标签
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      
      const postData = {
        title,
        content,
        categories,
        tags: tagsArray,
        cover,
        // 如果是新文章，添加日期，否则保留原日期
        date: post?.date || new Date().toISOString(),
      };
      
      await onSave(id, postData);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="post-editor">
      <div className="editor-header">
        <h2>{post ? '编辑文章' : '新建文章'}</h2>
        <div className="editor-actions">
          <button onClick={() => setPreview(!preview)} className="preview-button">
            {preview ? '返回编辑' : '预览'}
          </button>
          <button onClick={onCancel} className="cancel-button">取消</button>
          <button onClick={handleSave} className="save-button" disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
      
      {!preview ? (
        <div className="editor-form">
          <div className="form-group">
            <label htmlFor="title">标题</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categories">分类</label>
              <input
                type="text"
                id="categories"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                placeholder="文章分类"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tags">标签 (用逗号分隔)</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="标签1, 标签2, 标签3"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="cover">封面图片URL</label>
            <input
              type="text"
              id="cover"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="封面图片URL"
            />
            {cover && (
              <div className="cover-preview">
                <img src={cover} alt="文章封面预览" />
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="content">内容 (支持Markdown)</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在这里输入文章内容，支持Markdown格式"
              rows="15"
            />
          </div>
        </div>
      ) : (
        <div className="preview-container">
          <h1>{title}</h1>
          {cover && <div className="preview-cover"><img src={cover} alt={title} /></div>}
          <div className="preview-meta">
            <span>分类: {categories}</span>
            {tags && <span>标签: {tags}</span>}
          </div>
          <div className="preview-content" dangerouslySetInnerHTML={parseMarkdown(content)} />
        </div>
      )}
      
      <style>{`
        .post-editor {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        .editor-header h2 {
          margin: 0;
        }
        .editor-actions {
          display: flex;
          gap: 0.75rem;
        }
        .editor-actions button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        .preview-button {
          background-color: #607D8B;
          color: white;
        }
        .cancel-button {
          background-color: #9E9E9E;
          color: white;
        }
        .save-button {
          background-color: var(--vh-main-color, #01C4B6);
          color: white;
        }
        .save-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .editor-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .form-row .form-group {
          flex: 1;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-weight: 500;
          color: #333;
        }
        .form-group input, .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
        }
        .form-group textarea {
          min-height: 200px;
          resize: vertical;
        }
        .cover-preview {
          margin-top: 0.5rem;
          max-width: 300px;
          border-radius: 4px;
          overflow: hidden;
        }
        .cover-preview img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        .preview-container {
          padding: 1rem 0;
        }
        .preview-container h1 {
          margin-top: 0;
          margin-bottom: 1rem;
        }
        .preview-cover {
          margin-bottom: 1.5rem;
          border-radius: 8px;
          overflow: hidden;
          max-height: 400px;
        }
        .preview-cover img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        .preview-meta {
          display: flex;
          gap: 1rem;
          color: #666;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .preview-content {
          line-height: 1.6;
          color: #333;
        }
        .preview-content img {
          max-width: 100%;
          height: auto;
        }
        .preview-content h1, .preview-content h2, .preview-content h3 {
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .preview-content p {
          margin-bottom: 1rem;
        }
        .preview-content ul, .preview-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  );
};

// 文章查看组件
const PostViewer = ({ post, onBack, onEdit }) => {
  const parseMarkdown = (markdownText) => {
    return { __html: marked(markdownText) };
  };
  
  return (
    <div className="post-viewer">
      <div className="viewer-header">
        <h2>查看文章</h2>
        <div className="viewer-actions">
          <button onClick={onBack} className="back-button">返回列表</button>
          <button onClick={() => onEdit(post)} className="edit-button">编辑文章</button>
        </div>
      </div>
      
      <div className="viewer-content">
        <h1>{post.title}</h1>
        {post.cover && <div className="viewer-cover"><img src={post.cover} alt={post.title} /></div>}
        <div className="viewer-meta">
          <span>分类: {post.categories}</span>
          {post.tags && post.tags.length > 0 && (
            <span>标签: {post.tags.join(', ')}</span>
          )}
          <span>发布日期: {new Date(post.date).toLocaleDateString('zh-CN')}</span>
        </div>
        <div className="viewer-body" dangerouslySetInnerHTML={parseMarkdown(post.content)} />
      </div>
      
      <style>{`
        .post-viewer {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
        }
        .viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        .viewer-header h2 {
          margin: 0;
        }
        .viewer-actions {
          display: flex;
          gap: 0.75rem;
        }
        .viewer-actions button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        .back-button {
          background-color: #9E9E9E;
          color: white;
        }
        .edit-button {
          background-color: #2196F3;
          color: white;
        }
        .viewer-content {
          padding: 1rem 0;
        }
        .viewer-content h1 {
          margin-top: 0;
          margin-bottom: 1rem;
        }
        .viewer-cover {
          margin-bottom: 1.5rem;
          border-radius: 8px;
          overflow: hidden;
          max-height: 400px;
        }
        .viewer-cover img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        .viewer-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          color: #666;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .viewer-body {
          line-height: 1.6;
          color: #333;
        }
        .viewer-body img {
          max-width: 100%;
          height: auto;
        }
        .viewer-body h1, .viewer-body h2, .viewer-body h3 {
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .viewer-body p {
          margin-bottom: 1rem;
        }
        .viewer-body ul, .viewer-body ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  );
};

// 主管理组件
const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // list, edit, view
  const [currentPost, setCurrentPost] = useState(null);
  
  // 加载所有文章
  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (err) {
      console.error('加载文章失败:', err);
      setError('加载文章失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };
  
  // 组件加载时获取文章列表
  useEffect(() => {
    loadPosts();
  }, []);
  
  // 保存文章
  const handleSavePost = async (id, postData) => {
    try {
      if (id) {
        // 更新现有文章
        await blogService.updatePost(id, postData);
      } else {
        // 创建新文章
        await blogService.createPost(postData);
      }
      
      // 重新加载文章列表并返回列表视图
      await loadPosts();
      setView('list');
      return true;
    } catch (err) {
      console.error('保存文章失败:', err);
      alert('保存文章失败，请稍后再试');
      return false;
    }
  };
  
  // 删除文章
  const handleDeletePost = async (id) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      await blogService.deletePost(id);
      await loadPosts();
    } catch (err) {
      console.error('删除文章失败:', err);
      alert('删除文章失败，请稍后再试');
    }
  };
  
  // 编辑文章
  const handleEditPost = (post) => {
    setCurrentPost(post);
    setView('edit');
  };
  
  // 查看文章
  const handleViewPost = (post) => {
    setCurrentPost(post);
    setView('view');
  };
  
  // 新建文章
  const handleCreatePost = () => {
    setCurrentPost(null);
    setView('edit');
  };
  
  // 取消编辑
  const handleCancelEdit = () => {
    if (confirm('确定要取消编辑吗？未保存的更改将会丢失。')) {
      setView('list');
    }
  };
  
  // 返回列表视图
  const handleBackToList = () => {
    setView('list');
  };
  
  // 如果正在加载，显示加载状态
  if (loading && view === 'list') {
    return <div className="loading">正在加载文章...</div>;
  }
  
  // 如果有错误，显示错误信息
  if (error && view === 'list') {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={loadPosts} className="retry-button">重试</button>
      </div>
    );
  }
  
  // 根据当前视图渲染对应组件
  switch (view) {
    case 'edit':
      return (
        <PostEditor
          post={currentPost}
          onSave={handleSavePost}
          onCancel={handleCancelEdit}
        />
      );
    case 'view':
      return (
        <PostViewer
          post={currentPost}
          onBack={handleBackToList}
          onEdit={handleEditPost}
        />
      );
    case 'list':
    default:
      return (
        <PostsList
          posts={posts}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onView={handleViewPost}
          onCreateNew={handleCreatePost}
        />
      );
  }
};

export default PostsManager; 
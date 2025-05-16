import React, { useState, useEffect } from 'react';
import { talkingService } from '../../lib/supabase';
import { marked } from 'marked';

// 动态列表组件
const TalkingList = ({ talkings, onEdit, onDelete, onCreateNew }) => {
  return (
    <div className="talking-list">
      <div className="list-header">
        <h2>动态内容管理</h2>
        <button onClick={onCreateNew} className="create-button">发布新动态</button>
      </div>
      
      {talkings.length === 0 ? (
        <div className="no-talkings">
          <p>暂无动态内容，点击"发布新动态"开始创建</p>
        </div>
      ) : (
        <div className="talking-items">
          {talkings.map((talking) => (
            <div key={talking.id} className="talking-item">
              <div className="talking-header">
                <div className="talking-date">
                  {new Date(talking.date).toLocaleString('zh-CN')}
                </div>
                <div className="talking-tags">
                  {talking.tags.map((tag, index) => (
                    <span key={index} className="talking-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div 
                className="talking-content"
                dangerouslySetInnerHTML={{ __html: talking.content }}
              />
              <div className="talking-actions">
                <button onClick={() => onEdit(talking)} className="edit-button">编辑</button>
                <button onClick={() => onDelete(talking.id)} className="delete-button">删除</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        .talking-list {
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
        .no-talkings {
          padding: 2rem;
          text-align: center;
          color: #666;
        }
        .talking-items {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .talking-item {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 1rem;
          position: relative;
        }
        .talking-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f0f0f0;
        }
        .talking-date {
          color: #666;
          font-size: 0.9rem;
        }
        .talking-tags {
          display: flex;
          gap: 0.5rem;
        }
        .talking-tag {
          background-color: #f0f0f0;
          color: #666;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        .talking-content {
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .talking-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 0.5rem 0;
        }
        .talking-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .talking-actions button {
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .edit-button {
          background-color: #2196F3;
          color: white;
        }
        .delete-button {
          background-color: #F44336;
          color: white;
        }
      `}</style>
    </div>
  );
};

// 动态编辑器组件
const TalkingEditor = ({ talking, onSave, onCancel }) => {
  const [content, setContent] = useState(talking?.content || '');
  const [tags, setTags] = useState(talking?.tags ? talking.tags.join(', ') : '');
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // 解析内容中的图片链接
  const getImagesFromContent = () => {
    const regex = /<img.*?src=["'](.*?)["'].*?>/g;
    const matches = [...content.matchAll(regex)];
    return matches.map(match => match[1]);
  };
  
  const handleSave = async () => {
    setSaving(true);
    try {
      // 解析标签
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      
      const talkingData = {
        content,
        tags: tagsArray,
        // 如果是新动态，添加日期，否则保留原日期
        date: talking?.date || new Date().toISOString(),
      };
      
      await onSave(talking?.id, talkingData);
      return true;
    } catch (err) {
      console.error('保存动态失败:', err);
      return false;
    } finally {
      setSaving(false);
    }
  };
  
  const handleInsertImage = () => {
    const imageUrl = prompt('请输入图片URL');
    if (imageUrl) {
      // 在光标位置或内容末尾插入图片标签
      const imageHtml = `<p class="vh-img-flex"><img src="${imageUrl}"></p>`;
      setContent(content + imageHtml);
    }
  };
  
  return (
    <div className="talking-editor">
      <div className="editor-header">
        <h2>{talking ? '编辑动态' : '发布新动态'}</h2>
        <div className="editor-actions">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="preview-button"
          >
            {previewMode ? '返回编辑' : '预览'}
          </button>
          <button onClick={onCancel} className="cancel-button">取消</button>
          <button
            onClick={handleSave}
            className="save-button"
            disabled={saving}
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
      
      {!previewMode ? (
        <div className="editor-form">
          <div className="form-group">
            <label htmlFor="content">动态内容</label>
            <div className="content-editor-wrapper">
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在这里输入您的动态内容..."
                rows="6"
              ></textarea>
              <div className="editor-toolbar">
                <button 
                  type="button" 
                  onClick={handleInsertImage}
                  title="插入图片"
                >
                  📷 插入图片
                </button>
              </div>
            </div>
            <p className="editor-tip">提示: 图片请使用 &lt;p class="vh-img-flex"&gt;&lt;img src="图片URL"&gt;&lt;/p&gt; 格式</p>
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
          
          {getImagesFromContent().length > 0 && (
            <div className="image-previews">
              <h4>图片预览</h4>
              <div className="preview-images">
                {getImagesFromContent().map((src, index) => (
                  <div key={index} className="preview-image">
                    <img src={src} alt={`预览 ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="preview-container">
          <div className="preview-header">
            <div className="preview-date">
              {new Date().toLocaleString('zh-CN')}
            </div>
            <div className="preview-tags">
              {tags.split(',').map((tag, index) => (
                tag.trim() && <span key={index} className="preview-tag">{tag.trim()}</span>
              ))}
            </div>
          </div>
          <div 
            className="preview-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
      
      <style>{`
        .talking-editor {
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
          gap: 1.5rem;
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
          min-height: 150px;
          resize: vertical;
        }
        .editor-tip {
          font-size: 0.9rem;
          color: #666;
          margin-top: 0.25rem;
        }
        .content-editor-wrapper {
          position: relative;
        }
        .editor-toolbar {
          padding: 0.5rem;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 4px 4px;
        }
        .editor-toolbar button {
          background: none;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          margin-right: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .editor-toolbar button:hover {
          background-color: #f0f0f0;
        }
        .image-previews {
          margin-top: 1rem;
        }
        .image-previews h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
        .preview-images {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .preview-image {
          width: 150px;
          height: 150px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #eee;
        }
        .preview-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preview-container {
          padding: 1rem;
          border: 1px solid #eee;
          border-radius: 8px;
        }
        .preview-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f0f0f0;
        }
        .preview-date {
          color: #666;
          font-size: 0.9rem;
        }
        .preview-tags {
          display: flex;
          gap: 0.5rem;
        }
        .preview-tag {
          background-color: #f0f0f0;
          color: #666;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        .preview-content {
          line-height: 1.6;
        }
        .preview-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

// 主管理组件
const TalkingManager = () => {
  const [talkings, setTalkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // list, edit
  const [currentTalking, setCurrentTalking] = useState(null);
  
  // 加载所有动态
  const loadTalkings = async () => {
    setLoading(true);
    try {
      const data = await talkingService.getAllTalking();
      setTalkings(data);
    } catch (err) {
      console.error('加载动态失败:', err);
      setError('加载动态失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };
  
  // 组件加载时获取动态列表
  useEffect(() => {
    loadTalkings();
  }, []);
  
  // 保存动态
  const handleSaveTalking = async (id, talkingData) => {
    try {
      if (id) {
        // 更新现有动态
        await talkingService.updateTalking(id, talkingData);
      } else {
        // 创建新动态
        await talkingService.createTalking(talkingData);
      }
      
      // 重新加载动态列表并返回列表视图
      await loadTalkings();
      setView('list');
      return true;
    } catch (err) {
      console.error('保存动态失败:', err);
      alert('保存动态失败，请稍后再试');
      return false;
    }
  };
  
  // 删除动态
  const handleDeleteTalking = async (id) => {
    if (!confirm('确定要删除这条动态吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      await talkingService.deleteTalking(id);
      await loadTalkings();
    } catch (err) {
      console.error('删除动态失败:', err);
      alert('删除动态失败，请稍后再试');
    }
  };
  
  // 编辑动态
  const handleEditTalking = (talking) => {
    setCurrentTalking(talking);
    setView('edit');
  };
  
  // 新建动态
  const handleCreateTalking = () => {
    setCurrentTalking(null);
    setView('edit');
  };
  
  // 取消编辑
  const handleCancelEdit = () => {
    if (confirm('确定要取消编辑吗？未保存的更改将会丢失。')) {
      setView('list');
    }
  };
  
  // 如果正在加载，显示加载状态
  if (loading && view === 'list') {
    return <div className="loading">正在加载动态...</div>;
  }
  
  // 如果有错误，显示错误信息
  if (error && view === 'list') {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={loadTalkings} className="retry-button">重试</button>
      </div>
    );
  }
  
  // 根据当前视图渲染对应组件
  switch (view) {
    case 'edit':
      return (
        <TalkingEditor
          talking={currentTalking}
          onSave={handleSaveTalking}
          onCancel={handleCancelEdit}
        />
      );
    case 'list':
    default:
      return (
        <TalkingList
          talkings={talkings}
          onEdit={handleEditTalking}
          onDelete={handleDeleteTalking}
          onCreateNew={handleCreateTalking}
        />
      );
  }
};

export default TalkingManager; 
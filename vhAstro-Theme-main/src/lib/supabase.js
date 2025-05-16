import { createClient } from '@supabase/supabase-js';

// 创建Supabase客户端实例
// 您需要在.env文件中设置这些变量，或直接替换为您的实际值
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://jopnsrbsgeobveqeuyye.supabase.co';
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvcG5zcmJzZ2VvYnZlcWV1eXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMjExNjEsImV4cCI6MjA2Mjg5NzE2MX0.HGCrGBFREr_R_WA4fsWYKtJuHQH52NWwMEvH7yy-EIw';

export const supabase = createClient(supabaseUrl, supabaseKey);

// 博客文章相关操作
export const blogService = {
  // 获取所有博客文章
  async getAllPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // 获取单篇文章
  async getPostById(id) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // 创建文章
  async createPost(post) {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  // 更新文章
  async updatePost(id, post) {
    const { data, error } = await supabase
      .from('posts')
      .update(post)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  // 删除文章
  async deletePost(id) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};

// 动态内容相关操作
export const talkingService = {
  // 获取所有动态
  async getAllTalking() {
    const { data, error } = await supabase
      .from('talking')
      .select('*')
      .order('date', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // 创建动态
  async createTalking(talking) {
    const { data, error } = await supabase
      .from('talking')
      .insert([talking])
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  // 更新动态
  async updateTalking(id, talking) {
    const { data, error } = await supabase
      .from('talking')
      .update(talking)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  // 删除动态
  async deleteTalking(id) {
    const { error } = await supabase
      .from('talking')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};

// 朋友圈相关操作
export const friendsService = {
  // 获取所有朋友圈内容
  async getAllFriends() {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .order('date', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // 创建朋友圈内容
  async createFriend(friend) {
    const { data, error } = await supabase
      .from('friends')
      .insert([friend])
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  // 更新朋友圈内容
  async updateFriend(id, friend) {
    const { data, error } = await supabase
      .from('friends')
      .update(friend)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  // 删除朋友圈内容
  async deleteFriend(id) {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
}; 
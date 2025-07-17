import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('expenses').select('count(*)').limit(1);
    if (error) {
      console.error('Supabase接続テストエラー:', error);
      return { success: false, error: error.message };
    }
    console.log('Supabase接続テスト成功:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Supabase接続テストで例外発生:', error);
    return { success: false, error: error.message };
  }
}

export async function getTableInfo(tableName: string) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`テーブル ${tableName} の情報取得エラー:`, error);
      return { success: false, error: error.message };
    }
    
    console.log(`テーブル ${tableName} の情報:`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`テーブル ${tableName} の情報取得で例外発生:`, error);
    return { success: false, error: error.message };
  }
}
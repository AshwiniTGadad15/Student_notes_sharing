import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://attdpaxnyqdrteuzoizu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseApi = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  },
});

const tableName = 'app_data';

const getRecord = async () => {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }

  const { data } = await supabaseApi.get(`/${tableName}?select=*`);
  return data?.[0] || null;
};

const upsertRecord = async (payload) => {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }

  const existing = await getRecord();
  if (existing?.id) {
    const { data } = await supabaseApi.patch(`/${tableName}?id=eq.${existing.id}`, payload);
    return data?.[0] || null;
  }

  const { data } = await supabaseApi.post(`/${tableName}`, payload);
  return data?.[0] || null;
};

export const supabaseStorage = {
  async read() {
    const record = await getRecord();
    return record?.data || { users: [], notes: [], categories: [], bookmarks: [], downloads: [], ratings: [], notifications: [] };
  },
  async write(data) {
    return upsertRecord({ data });
  },
};

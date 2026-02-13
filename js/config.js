/**
 * Supabase REST API 직접 사용 (라이브러리 없음)
 */
const SUPABASE_URL = 'https://zfiwdbehmsdjnmflumfn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_R8bdG2HpEuXT4Uj31eMRbQ_qWcTUxlH';

/**
 * Supabase REST API를 사용한 쿼리
 */
async function supabaseQuery(table, method = 'GET', data = null) {
  let url = `${SUPABASE_URL}/rest/v1/${table}`;

  // select 파라미터 추가 (POST/PATCH/DELETE 응답 포함)
  if (!url.includes('?')) {
    url += '?select=*';
  } else if (!url.includes('select=')) {
    url += '&select=*';
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    // DELETE는 응답이 없을 수 있음
    if (method === 'DELETE') {
      return { data: [], error: null };
    }

    // 응답이 비어있을 수 있으므로 안전하게 처리
    const text = await response.text();
    const responseData = text ? JSON.parse(text) : [];
    return { data: responseData, error: null };
  } catch (error) {
    console.error(`Supabase API 오류 (${table}):`, error);
    return { data: null, error };
  }
}

// 전역 supabase 객체 (호환성)
const supabase = {
  from: (table) => ({
    select: (columns = '*') => ({
      eq: (column, value) => ({
        order: (orderCol, opts) => ({
          then: (callback) => {
            supabaseQuery(`${table}?${column}=eq.${value}&order=${orderCol}.${opts.ascending ? 'asc' : 'desc'}`).then(callback);
          },
          catch: () => Promise.resolve({ data: [], error: null })
        }),
        then: (callback) => {
          supabaseQuery(`${table}?${column}=eq.${value}`).then(callback);
        }
      }),
      order: (orderCol, opts) => ({
        then: (callback) => {
          supabaseQuery(`${table}?order=${orderCol}.${opts.ascending ? 'asc' : 'desc'}`).then(callback);
        },
        catch: () => Promise.resolve({ data: [], error: null })
      }),
      single: () => ({
        then: (callback) => {
          supabaseQuery(`${table}?id=eq.${value}`).then((result) => {
            callback({ data: result.data?.[0], error: result.error });
          });
        }
      }),
      then: (callback) => {
        supabaseQuery(table).then(callback);
      },
      catch: () => Promise.resolve({ data: [], error: null })
    }),
    insert: (payload) => ({
      select: () => ({
        then: (callback) => {
          supabaseQuery(table, 'POST', payload).then(callback);
        },
        catch: (errorCallback) => {
          supabaseQuery(table, 'POST', payload).then(
            (result) => callback(result),
            (error) => errorCallback(error)
          );
        }
      })
    }),
    update: (payload) => ({
      eq: (column, value) => ({
        select: () => ({
          then: (callback) => {
            supabaseQuery(`${table}?${column}=eq.${value}`, 'PATCH', payload).then(callback);
          },
          catch: (errorCallback) => {
            supabaseQuery(`${table}?${column}=eq.${value}`, 'PATCH', payload).then(
              (result) => callback(result),
              (error) => errorCallback(error)
            );
          }
        })
      })
    }),
    delete: () => ({
      eq: (column, value) => ({
        then: (callback) => {
          supabaseQuery(`${table}?${column}=eq.${value}`, 'DELETE').then(callback);
        },
        catch: (errorCallback) => {
          supabaseQuery(`${table}?${column}=eq.${value}`, 'DELETE').then(
            (result) => callback(result),
            (error) => errorCallback(error)
          );
        }
      })
    })
  })
};

console.log('✅ Supabase REST API 초기화 완료');

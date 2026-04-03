import { useState, useEffect } from 'react';
import type { TentUI } from '@/types';
import { getSupabaseClient } from '@/lib/supabase';
import { mapCarpaToTentUI, getStaticTents } from '@/lib/utils';

export function useTents() {
  const [tents, setTents] = useState<TentUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTents() {
      try {
        setIsLoading(true);
        const supabase = getSupabaseClient();

        if (!supabase) {
          setTents(getStaticTents());
          return;
        }

        const { data, error } = await supabase.from('carpas').select('*');
        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.slice(0, 4).map(mapCarpaToTentUI);

          if (mapped.length < 3) {
            const existingTitles = new Set(mapped.map((m: TentUI) => m.title.toLowerCase()));
            const extras = getStaticTents().filter(
              (t) => !existingTitles.has(t.title.toLowerCase()),
            );
            setTents([...mapped, ...extras].slice(0, 6));
          } else {
            setTents(mapped);
          }
        } else {
          setTents(getStaticTents());
        }
      } catch (error) {
        console.error('[useTents] Error fetching tents:', error);
        setTents(getStaticTents());
      } finally {
        setIsLoading(false);
      }
    }

    fetchTents();
  }, []);

  return { tents, isLoading };
}

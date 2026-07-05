import { useEffect, useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import Input from '../ui/Input';
import { cn } from '@/lib/utils';

interface Props {
  placeholder: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  debounce?: boolean;
  dir?: 'rtl' | 'ltr' | 'auto';
}

export default function SearchInput({
  placeholder,
  className = '',
  inputClassName = '',
  disabled = false,
  debounce = false,
  dir = 'auto',
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('query') ?? '');

  useEffect(() => {
    if (search === '') {
      setSearchParams(prev => {
        prev.delete('query');
        return prev;
      });
      return;
    }

    if (!debounce) {
      setSearchParams(prev => {
        prev.set('query', search);
        return prev;
      });
      return;
    }

    const timerId = setTimeout(() => {
      setSearchParams(prev => {
        prev.set('query', search);
        return prev;
      });
    }, 500);

    return () => clearTimeout(timerId);
  }, [search, setSearchParams, debounce]);

  const isRtl = dir === 'rtl';

  return (
    <div
      dir={dir}
      className={cn('relative flex items-center', className)}
    >
      <Input
        type="text"
        dir={dir}
        placeholder={placeholder}
        value={search}
        onChange={e => setSearch(e.target.value)}
        spellCheck={false}
        disabled={disabled}
        className={cn(
          'peer',
          isRtl ? 'pl-10 pr-10 text-right' : 'pl-10 pr-10 text-left',
          inputClassName,
        )}
      />

      <SearchIcon
        className={cn(
          'pointer-events-none absolute h-5 w-5 text-muted-foreground peer-focus:text-primary',
          isRtl ? 'right-2.5' : 'left-2.5',
        )}
      />

      {search ? (
        <button
          type="button"
          className={cn(
            'absolute text-muted-foreground peer-focus:text-primary',
            isRtl ? 'left-2.5' : 'right-2.5',
          )}
          onClick={() => setSearch('')}
        >
          <XIcon className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  );
}

'use client'

import { useParams } from 'next/navigation'
import { useMemo } from 'react'

const page = () => {
    const params = useParams<{ id?: string | string[] }>();
    const id = useMemo(() => {
        const raw = params?.id;
        if (!raw) return "";
        return Array.isArray(raw) ? raw[0] ?? "" : raw;
    }, [params]);
    
  return (
    <div>
        Project page for {id}
    </div>
  )
}

export default page

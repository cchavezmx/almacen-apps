import { useRouter } from 'next/router'
import { useEffect } from 'react'

const MenuButton = ({ open = false, setOpen }) => {
  const router = useRouter()
  useEffect(() => {
    return () => {
      setOpen(false)
    }
  }, [router, setOpen])
  return (
<div style={{ display: open ? 'flex' : 'none' }}>
    <div className="menu_flotante text-bg-gray-300 flex flex-col gap-1">
        <button
            onClick={() => router.push('/')}
            className="bg-[#60a5fa] w-full h-10 hover:bg-opacity-30">
            <span className="text-gray-bg-light-100">Home</span>
        </button>
        <button
            className="bg-[#60a5fa] w-full h-10 hover:bg-opacity-30"
            onClick={() => router.push('/experimental', undefined, { shallow: false })}>
            <span className="text-gray-bg-light-100">Experimental</span>
        </button>
    </div>
</div>
  )
}

export default MenuButton

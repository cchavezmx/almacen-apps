import { Router, useRouter } from "next/router"

const MenuButton = ({ open = false }) => {
    const router = useRouter()
 return (
<div style={{ display: open ? 'flex' : 'none' }}>
    <div className="menu_flotante text-bg-gray-300 flex flex-col gap-1">        
        <button className="bg-[#60a5fa] w-full h-10 hover:bg-opacity-30">
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



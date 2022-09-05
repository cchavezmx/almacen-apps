
export default function Button ({ color = 'blue', onClick, width, children, height, type }) {
  const colors = {
    blue: 'bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded',
    red: 'bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded',
    green: 'bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded'
  }

  return (
    <button
      className={`${colors[color]}`}
      onClick={onClick}
      style={{ width: width || '15rem', height: `${height}` || '25px' }}
      type={type}
    >
      { children }
    </button>
  )
}

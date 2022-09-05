export default function Input (params) {
  const { placeholder, helperLabelText } = params
  const inputStyle = 'rounded border-transparent appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
  return (
    <>
      { helperLabelText && <label className="text-black" htmlFor={params.id}>{helperLabelText}</label> }
      <input
        className={inputStyle}
        type={params.type || 'text' }
        placeholder={placeholder}
        id={params.id}
        style={{ width: `${params.width}rem`, height: `${params.height}rem` }}
        onChange={params.onChange}
      />
    </>
  )
}

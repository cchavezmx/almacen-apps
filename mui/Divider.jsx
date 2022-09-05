export default function Divider ({ content, className }) {
  return (
    <div className={`flex items-center ${className}`}>
      <h4 className="flex-shrink-0 pr-4 bg-white text-sm leading-5 tracking-wider font-semibold uppercase text-indigo-600">
          { content }
      </h4>
      <div className="flex-1 border-t-2 border-gray-200"></div>
    </div>
  )
}

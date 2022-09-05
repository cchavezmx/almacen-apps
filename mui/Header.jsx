export default function HeaderEmpresa ({ headerName }) {
  return (
    <div className="flex w-full h-[5rem] justify-between px-8 items-center space-x-2 bg-white">
        <h1 className="flex ml-2 text-4xl font-bold gap-1">
          <span className="text-gray-800">
            { headerName }
          </span>
        </h1>
        <div className="rounded-full h-[3rem] w-[3rem] flex items-center justify-center bg-yellow-400">
          <span className="text-white">
            CH
          </span>
        </div>
    </div>
  )
}

type PdfNavigatorProps = {
  pages: string[]
}

export const PdfNavigator = (props: PdfNavigatorProps) => {
  return (
    <div className="flex flex-col flex-1 space-y-2 p-3 overflow-y-auto h-full bg-muted ">
      {props.pages.map((page, index) => (
        <img
          key={`page-${index}`}
          src={page}
          alt={`Page ${index + 1}`}
          className="w-full shadow rounded-lg"
        />
      ))}
    </div>
  )
}

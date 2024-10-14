type PdfNavigatorProps = {
  pages: string[]
}

export const PdfNavigator = (props: PdfNavigatorProps) => {
  return (
    <div className="bg-muted p-3">
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

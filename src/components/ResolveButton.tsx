import { useNavigate } from 'react-router-dom'

interface ResolveButtonProps {
  name: string | undefined
  parent: string | undefined
  text?: string
}
export default function ResolveButton(props: ResolveButtonProps) {
  const navigate = useNavigate()
  return (
    <>
      <button
        onClick={() => navigate(`/resolve?name=${props.name}&parent=${props.parent}`)}
        className="btn-secondary w-32 py-1 rounded-md h-10"
      >
        {props.text ?? 'See More'}
      </button>
    </>
  )
}

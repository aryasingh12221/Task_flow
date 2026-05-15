import { getAvatarInitials } from '../../utils/colorUtils'

export default function Avatar({ name, size = 24, color = '#0C66E4' }) {
  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-semibold"
      title={name}
      style={{ width: size, height: size, backgroundColor: color, fontSize: size / 2.5 }}
    >
      {getAvatarInitials(name)}
    </div>
  )
}

import logo from '../assets/SAI-LOGO.png'

export default function MainPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <img
        src={logo}
        alt="Site logo"
        className="w-40 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto select-none"
        draggable={false}
      />
    </div>
  )
}
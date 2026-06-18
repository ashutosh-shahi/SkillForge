interface ToastProps {
  message: string;
}

export default function Toast({
  message,
}: ToastProps) {
  return (
    <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50">
      {message}
    </div>
  );
}
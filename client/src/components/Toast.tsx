interface ToastProps {
  message: string;
  type?: "success" | "error";
}

export default function Toast({
  message,
  type = "success",
}: ToastProps) {
  const bgColor = type === "error" ? "bg-rose-600" : "bg-emerald-600";
  return (
    <div className={`fixed top-5 right-5 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all font-medium`}>
      {message}
    </div>
  );
}
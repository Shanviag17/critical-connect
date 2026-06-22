export default function StatCard({ title, value, color }) {
  return (
    <div
      className="
        bg-gradient-to-br
        from-slate-900
        to-slate-800
        rounded-2xl
        p-6
        border
        border-slate-700
        hover:border-red-500
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-red-500/10
        transition-all
        duration-300
      "
    >
      <p className="text-gray-400 text-sm font-medium">
        {title}
      </p>

      <h3 className={`text-4xl font-bold mt-3 ${color}`}>
        {value}
      </h3>
    </div>
  );
}
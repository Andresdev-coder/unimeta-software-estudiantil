export default function GradientStatCard({
  icon: Icon,
  label,
  value,
  gradient,
}) {
  return (
    <div className={`rounded-2xl p-5 text-white shadow-md ${gradient}`}>
      <div className="mb-6">
        <div className="inline-flex p-2 rounded-lg bg-white/20">
          <Icon size={20} />
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-white/80 mt-1">{label}</p>
    </div>
  );
}
